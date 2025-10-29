import './scss/styles.scss';

import { apiProducts } from './utils/data.ts';

import { Api } from './components/base/Api.ts';
import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';
import DataService from './components/services/DataService.ts';

import { IProduct } from './types/index.ts';
import { API_URL } from './utils/constants.ts';
import { EventEmitter } from './components/base/Events.ts';


const events = new EventEmitter();

// создаем сервис для коммуникации с сервером
const api = new Api(API_URL);
const dataService = new DataService(api);

// создаем экземпляры моделей
const productsModel = new Products(events);
const cartModel = new Cart();
const customerModel = new Customer();


// получаем товары с сервера
dataService.getProducts()
           .then((items) => {
              // сохраняем товары с сервера в модель каталога
              productsModel.setItems(items);
              console.log('Массив товаров из каталога, полученные с сервера:', productsModel.getItems());
           })
           .catch((error) => console.error('Ошибка при получении товаров:', error.message));
