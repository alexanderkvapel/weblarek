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
const cartModel = new Cart(events);
const customerModel = new Customer(events);

// шаблоны
const galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');

// создаем экземпляры представлений
const headerView = new Header(ensureElement<HTMLElement>('.header'), events);
const galleryView = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const cartView = new CartView(cloneTemplate(cartTemplate), events);
const modalView = new Modal(modalTemplate);
let formOrder: FormOrder | null = null;
let formContacts: FormContacts | null = null;

// Обновляет товары в корзине
function updateCart() {
  const items = cartModel.getItems().map((item, index) => {
    const card = new CardCart(cloneTemplate(cartCardTemplate), {
      onDelete: () => cartModel.deleteItem(item.id),
    });

    card.index = index + 1;
    card.title = item.title;
    card.price = item.price;

    return card.render();
  });

  cartView.items = items;
  cartView.totalPrice = cartModel.getItemsCost();
  modalView.content = cartView.render();
}


// получаем товары с сервера
dataService.getProducts()
           // сохраняем товары с сервера в модель каталога
           .then((items) => {
              productsModel.setItems(items);
           })
           .catch((error) => console.error('Ошибка при получении товаров:', error.message));


// обновление списка карточек товаров
events.on('gallery:update', () => {
  const items = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(galleryCardTemplate), {
      onClick: () => events.emit('card:open', { item }),
    });

    card.id = item.id;
    card.title = item.title;
    card.category = item.category;
    card.price = item.price;
    card.image = `${CDN_URL}${item.image}`.replace('svg', 'png');

    return card.render();
  });

  galleryView.catalog = items;
});

// открытие модального окна с карточкой товара
events.on<{ item: IProduct }>('card:open', ({ item }) => {
  const card = new CardPreview(cloneTemplate(previewCardTemplate), {
    onClick: () => events.emit('card:add-to-cart', { item }),
  });

  card.title = item.title;
  card.category = item.category;
  card.description = item.description;
  card.price = item.price;
  card.image = `${CDN_URL}${item.image}`.replace('svg', 'png');
  card.inCart = cartModel.isItemInCart(item.id);

  modalView.open(card.render());
});

// добавление товара в корзину
events.on<{ item: IProduct }>('card:add-to-cart', ({ item }) => {
  if (item.price === null) return;

  if (cartModel.isItemInCart(item.id)) cartModel.deleteItem(item.id);
  else cartModel.addItem(item);

  modalView.close();
})

// обновление корзины
events.on('cart:update', () => {
  headerView.counter = cartModel.getItemsCount();

  if (modalTemplate.classList.contains('modal_active')) updateCart();
});

// открытие корзины
events.on('cart:open', () => {
  updateCart();
  modalView.open(cartView.render());
});

// первая страница оформления заказа
events.on('order:order', () => {
  formOrder = new FormOrder(cloneTemplate(orderFormTemplate), {
    onInput: (field, value) => customerModel.setData({ [field]: value }),
    onPaymentSelect: (payment) => customerModel.setData({ payment }),
    onSubmit: () => {
      modalView.close();
      events.emit('order:contacts');
    },
  });

  formContacts = null;
  modalView.open(formOrder.render());
});

// вторая страница оформления заказа
events.on('order:contacts', () => {
  formContacts = new FormContacts(cloneTemplate(contactsFormTemplate), {
    onInput: (field, value) => customerModel.setData({ [field]: value }),
    onSubmit: () => {
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
                 .then(() => {
                   cartModel.clearItems();
                   customerModel.clearData();

                   const success = new Success(cloneTemplate(successTemplate), {
                     onOrdered: () => modalView.close(),
                   });

                   success.totalPrice = orderData.total;
                   modalView.open(success.render());
                 })
                 .catch((error) => console.error('Ошибка при отправке заказа:', error.message));
    }
  });

  formOrder = null;
  modalView.open(formContacts.render());
});

// изменение данных в оформлении заказа
events.on('order:update', () => {
  const errors = customerModel.validateData();

  if (formOrder) {
    const { email, phone, ...currentErrors } = errors;
    formOrder.validate(currentErrors);
  }
  
  if (formContacts) {
    const { payment, address, ...currentErrors } = errors;
    formContacts.validate(currentErrors);
  }
});
