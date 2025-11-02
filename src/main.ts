import './scss/styles.scss';
import { Api } from './components/base/Api.ts';
import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';
import DataService from './components/services/DataService.ts';
import { IOrderRequest, IProduct } from './types/index.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { EventEmitter } from './components/base/Events.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { Header } from './components/views/Header.ts';
import { Gallery } from './components/views/Gallery.ts';
import { Modal } from './components/views/Modal.ts';
import { CardCatalog } from './components/views/Card/CardCatalog.ts';
import { CardPreview } from './components/views/Card/CardPreview.ts';
import { Cart as CartView } from './components/views/Cart.ts';
import { CardCart } from './components/views/Card/CardCart.ts';
import { FormOrder } from './components/views/Form/FormOrder.ts';
import { FormContacts } from './components/views/Form/FormContacts.ts';
import { Success } from './components/views/Success.ts';


// создаем событийный брокер
const events = new EventEmitter();

// создаем сервис для коммуникации с сервером
const api = new Api(API_URL);
const dataService = new DataService(api);

// создаем экземпляры моделей
const productsModel = new Products(events);
const cartModel = new Cart();
const customerModel = new Customer();

// создаем экземпляры представлений
const headerView = new Header(ensureElement<HTMLElement>('.header'), events);
const galleryView = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const modalView = new Modal(ensureElement<HTMLElement>('.modal'), events);

// шаблоны
const galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


// получаем товары с сервера
dataService.getProducts()
           // добавляем изображение каждой карточке
           .then(items => items.map(item => (
            { ...item, image: `${CDN_URL}/${item.image}`.replace('svg', 'png') }
           )))
           // сохраняем товары с сервера в модель каталога
           .then((items) => {
              productsModel.setItems(items);
           })
           .catch((error) => console.error('Ошибка при получении товаров:', error.message));


// обновление списка карточек товаров
events.on('gallery:changed', () => {
  const items = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(galleryCardTemplate), events);

    return card.render(item);
  });

  galleryView.render({ catalog: items });
});

// открытие модального окна с карточкой товара
events.on('card:open', (event: { id: string }) => {
  const item = productsModel.getItemById(event.id);
  if (!item) return;

  const card = new CardPreview(cloneTemplate(previewCardTemplate), events);
  const isCardInCart = cartModel.isItemInCart(event.id);

  productsModel.setSelectedItem(event.id);
  modalView.render({ content: card.render(item, isCardInCart) });
  modalView.open();
});

// добавление товара в корзину
events.on('card:add-to-cart', (event: { id: string }) => {
  const item = productsModel.getItemById(event.id);
  if (!item) return;

  cartModel.addItem(item);
  headerView.counter = cartModel.getItemsCount();
});

// удаление товара из корзины
events.on('card:delete-from-cart', (event: { id: string }) => {
  const item = productsModel.getItemById(event.id);
  if (!item) return;

  cartModel.deleteItem(item.id);
  headerView.counter = cartModel.getItemsCount();
});

// открытие корзины
events.on('cart:open', () => {
  const cart = new CartView(cloneTemplate(cartTemplate), events);
  const cartItems = cartModel.getItems().map((item, index) => {
    const card = new CardCart(cloneTemplate(cartCardTemplate), events);

    card.index = index + 1;
    card.title = item.title;
    card.price = item.price;

    return card.render(item);
  });

  cart.items = cartItems;
  cart.totalPrice = cartModel.getItemsCost();
  modalView.render({ content: cart.render() });
  modalView.open();
});

// первая страница оформления заказа
events.on('order:order', () => {
  const order = new FormOrder(cloneTemplate(orderFormTemplate), {
    onAddressInput: (address) => {
      customerModel.setData({ address: address });

      const errors = customerModel.validateData();
      const { phone, email, ...currentErrors } = errors;
      order.validateOrder(currentErrors);
    },
    onPaymentMethodSelect: (paymentMethod) => {
      customerModel.setData({ payment: paymentMethod });

      const errors = customerModel.validateData();
      const { phone, email, ...currentErrors } = errors;
      order.validateOrder(currentErrors);
    },
    onSubmit: () => {
      const orderData = order.orderData;

      customerModel.setData({
        payment: orderData.payment,
        address: orderData.address,
      });
    },
  }, events);

  order.paymentMethod = customerModel.getData()?.payment;
  order.address = customerModel.getData()?.address || '';

  modalView.render({ content: order.render() });
  modalView.open();
});

// вторая страница оформления заказа
events.on('order:contacts', () => {
  const contacts = new FormContacts(cloneTemplate(contactsFormTemplate), {
    onEmailInput: (email) => {
      customerModel.setData({ email: email });

      const errors = customerModel.validateData();
      const { payment, address, ...currentErrors } = errors;
      contacts.validateContacts(currentErrors);
    },
    onPhoneInput: (phone) => {
      customerModel.setData({ phone: phone });

      const errors = customerModel.validateData();
      const { payment, address, ...currentErrors } = errors;
      contacts.validateContacts(currentErrors);
    },
    onSubmit: async () => {
      const contactsData = contacts.contactsData;

      customerModel.setData({
        email: contactsData.email,
        phone: contactsData.phone,
      });

      const orderData: IOrderRequest = {
        payment: customerModel.getData()?.payment,
        address: customerModel.getData()?.address,
        email: customerModel.getData()?.email,
        phone: customerModel.getData()?.phone,
        total: cartModel.getItemsCost(),
        items: cartModel.getItems().map(item => item.id),
      };

      try {
        const result = await dataService.postOrder(orderData);
        events.emit('order:success', result);
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
      }
    }
  });

  modalView.render({ content: contacts.render() });
  modalView.open();
});

// страница успеха оформления заказа
events.on('order:success', (result: { total: number }) => {
  const success = new Success(cloneTemplate(successTemplate), {
    onOrdered: () => {
      modalView.close();
    }
  });

  success.totalPrice = result.total;
  modalView.render({ content: success.render() });
  modalView.open();

  cartModel.clearItems();
  customerModel.clearData();
  headerView.counter = cartModel.getItemsCount();
});
