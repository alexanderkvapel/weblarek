import './scss/styles.scss';
import { IOrderRequest, TPayment } from './types/index.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { Api } from './components/base/Api.ts';
import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';
import DataService from './components/services/DataService.ts';
import { Header } from './components/views/Header.ts';
import { Catalog } from './components/views/Catalog.ts';
import { Modal } from './components/views/Modal.ts';
import { CardCart } from './components/views/Card/CardCart.ts';
import { CardCatalog } from './components/views/Card/CardCatalog.ts';
import { CardPreview } from './components/views/Card/CardPreview.ts';
import { Cart as CartView } from './components/views/Cart.ts';
import { FormOrder } from './components/views/Form/FormOrder.ts';
import { FormContacts } from './components/views/Form/FormContacts.ts';
import { Success } from './components/views/Success.ts';


// создаем событийный брокер
const events = new EventEmitter();

// создаем сервис для коммуникации с сервером
const dataService = new DataService(new Api(API_URL));

// создаем экземпляры моделей
const productsModel = new Products(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

// шаблоны
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// создаем экземпляры представлений
const headerView = new Header(ensureElement<HTMLElement>('.header'), events);
const catalogView = new Catalog(ensureElement<HTMLElement>('.page__wrapper'));
const cartView = new CartView(cloneTemplate(cartTemplate), events);
const modalView = new Modal(ensureElement<HTMLTemplateElement>('#modal-container'), events);
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), events)
const formOrderView = new FormOrder(cloneTemplate(formOrderTemplate), events);
const formContactsView = new FormContacts(cloneTemplate(formContactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);


// получаем товары с сервера
dataService.getProducts()
           // добавляем путь до картинки каждому товару
           .then((items) => items.map(item => (
            { ...item, image: `${CDN_URL}${item.image}`.replace('svg', 'png') }
           )))
           // сохраняем товары с сервера в модель каталога
           .then((items) => {
              productsModel.setItems(items);
           })
           // обрабатываем ошибки
           .catch((error) => console.error('Ошибка при получении товаров:', error.message));

events.on('modal:closed', () => {
  if (productsModel.getSelectedItem()) {
    productsModel.setSelectedItem('');
  }

  modalView.render({
    content: null,
    isOpen: false,
  });
});

events.on('products:saved', () => {
  const items = productsModel.getItems().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    
    return card.render({ ...item });
  });

  catalogView.render({ catalog: items });
});

events.on('card:clicked', ({ id }: { id:string }) => {
  const item = productsModel.getItemById(id);

  if (item) {
    productsModel.setSelectedItem(item.id);
  }
});

events.on('card:selected', () => {
  const item = productsModel.getSelectedItem();

  if (item) {
    const inCart = cartModel.isItemInCart(item.id);

    modalView.render({
      content: cardPreviewView.render({ 
        ...item, 
        inCart,
      }),
      isOpen: true,
    });
  };
});

events.on('card:button-clicked', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);

  if (item) {
    if (cartModel.isItemInCart(item.id)) {
      cartModel.deleteItem(item.id);
    } else {
      cartModel.addItem(item);
    }

    modalView.render({
      content: null,
      isOpen: false,
    });
  }
});

events.on('card:delete-from-cart', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);

  if (item) {
    cartModel.deleteItem(item.id);
  }
});

events.on('cart:clicked', () => {
  modalView.render({
    content: cartView.render(),
    isOpen: true,
  });
});

events.on('cart:updated', () => {
  const items = cartModel.getItems().map((item, index) => {
    const card = new CardCart(cloneTemplate(cardCartTemplate), events);
    card.index = index + 1;

    return card.render({ ...item });
  });

  cartView.render({ 
    items, 
    totalPrice: cartModel.getItemsCost(),
  });

  headerView.render({ counter: cartModel.getItemsCount() });
});

events.on('form:order', () => {
  modalView.render({
    content: formOrderView.render(),
    isOpen: true,
  });
});

events.on('payment:chosen', ({ value }: { value: TPayment }) => {
  customerModel.setData({ payment: value });
  formOrderView.paymentMethod = value;
});

events.on('address:chosen', ({ value }: { value: string }) => {
  customerModel.setData({ address: value });
  formOrderView.address = value;
});

events.on('email:chosen',  ({ value }: { value: string }) => {
  customerModel.setData({ email: value });
  formContactsView.email = value;
});

events.on('phone:chosen',  ({ value }: { value: string }) => {
  customerModel.setData({ phone: value });
  formContactsView.phone = value;
});

events.on('customer:updated', () => {
  const errors = customerModel.validateData();

  const { payment, address, phone, email } = errors;

  formOrderView.validate({ payment, address });
  formContactsView.validate({ phone, email });
});

events.on('order:submit', () => {
  modalView.render({
    content: formContactsView.render(),
    isOpen: true,
  });
});

events.on('contacts:submit', () => {
  const contactsData = customerModel.getData();
 
  const orderData: IOrderRequest = { 
    payment: contactsData.payment, 
    address: contactsData.address, 
    email: contactsData.email, 
    phone: contactsData.phone, 
    total: cartModel.getItemsCost(), 
    items: cartModel.getItems().map(item => item.id), 
  };

  dataService.postOrder(orderData)
             .then((response) => {
               modalView.render({
                content: successView.render({ totalPrice: response.total }),
                isOpen: true,
               });

               cartModel.clearItems();
               customerModel.clearData();
               formOrderView.reset();
               formContactsView.reset();
             })
             .catch((error) => console.error('Ошибка при отправке заказа:', error.message));
});
