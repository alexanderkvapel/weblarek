import './scss/styles.scss';

import { apiProducts } from './utils/data.ts';

import { Api } from './components/base/Api.ts';
import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';
import DataService from './components/services/DataService.ts';

import { IProduct } from './types/index.ts';
import { API_URL } from './utils/constants.ts';


// создаем сервис для коммуникации с сервером
const api = new Api(API_URL);
const dataService = new DataService(api);

// создаем экземпляры моделей
const productsModel = new Products();
const cartModel = new Cart();
const customerModel = new Customer();


// Временные функции для тестирования функционала
/**
 * Вывод информации из корзины
 * @param {Cart} cart экземпляр модели корзины
 */
function logCartStatus(cart: Cart): void {
  console.log('\tКол-во товаров в корзине:', cart.getItemsCount());
  console.log('\tОбщая стоимость товаров в корзине:', cart.getItemsCost());
  console.log('\tТовары в корзине:', cart.getItems());
}

/**
 * 
 * @param cart экземпляр модели корзины
 * @param item добавляемый товар
 */
function addToCart(cart: Cart, item: IProduct | null): void {
  if (item) cart.addItem(item);
}

/**
 * Вывод информации из корзины
 * @param {Customer} customer экземпляр модели корзины
 */
function logCustomerStatus(customer: Customer): void {
  console.log('\tДанные покупателя:', customer.getData());
  console.log('\tОшибки валидации:', customer.validateData());
}


// Тестирование функционала
// сохраняем товары в модель каталога
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

// Находим товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9'
const someItem = productsModel.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товар с id=\"c101ab44-ed99-4a54-990d-47aa2bb4e7d9\":', someItem);

// сохраняем товар с id='412bcf81-7e75-4e70-bdb9-d3c73c9803b7' для подробного отображения
productsModel.setSelectedItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
const selectedItem = productsModel.getSelectedItem();
console.log('Выбранный товар для подробного отображения:', selectedItem);


// Добавляем товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' в корзину:
console.log('Добавляем товар с id=\"c101ab44-ed99-4a54-990d-47aa2bb4e7d9\" в корзину');
addToCart(cartModel, someItem);
logCartStatus(cartModel);
console.log('\tТовар с id=\"c101ab44-ed99-4a54-990d-47aa2bb4e7d9\" в наличии?:', cartModel.isItemInCart('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

// Добавляем выбранный товар для подробного отображения в корзину
console.log('Добавляем выбранный товар для подробного отображения в корзину');
addToCart(cartModel, selectedItem);
logCartStatus(cartModel);
console.log('\tВыбранный товар для отображения в наличии?:', cartModel.isItemInCart('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

// // Удаляем товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' из корзины:
console.log('Удаляем товар с id=\"c101ab44-ed99-4a54-990d-47aa2bb4e7d9\" из корзины');
cartModel.deleteItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
logCartStatus(cartModel);
console.log('\tТовар с id=\"c101ab44-ed99-4a54-990d-47aa2bb4e7d9\" в наличии?:', cartModel.isItemInCart('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

// Очищаем корзину
console.log('Очищаем корзину');
cartModel.clearItems();
logCartStatus(cartModel);


console.log('Ошибки валидации:', customerModel.validateData());
// Записываем в данные покупателя способ оплаты:
console.log('Устанавливаем тип оплаты')
customerModel.setData({ payment: 'CASH' });
logCustomerStatus(customerModel);

console.log('Устанавливаем адрес')
customerModel.setData({ address: 'г. Москва, Кутузовский пр-кт, д. 32' });
logCustomerStatus(customerModel);

console.log('Устанавливаем емэйл')
customerModel.setData({ email: 'test@mail.ru' });
logCustomerStatus(customerModel);

console.log('Устанавливаем номер телефона');
customerModel.setData({ phone: '+7 (999) 999-99-99' });
logCustomerStatus(customerModel);

// Очищаем данные покупателя
console.log('Очищаем данные покупателя')
customerModel.clearData();
logCustomerStatus(customerModel);

// получаем товары с сервера
dataService.getProducts()
           .then((items) => {
              // сохраняем товары с сервера в модель каталога
              productsModel.setItems(items);
              console.log('Массив товаров из каталога, полученные с сервера:', productsModel.getItems());
           })
           .catch((error) => console.error('Ошибка при получении товаров:', error.message));
