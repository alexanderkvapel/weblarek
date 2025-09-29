import './scss/styles.scss';

import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';
import DataService from './components/services/DataService.ts';
import { IProduct, TField } from './types/index.ts';


// создаем сервис для коммуникации с сервером
const dataService = new DataService();

// создаем экземпляры моделей
const productsModel = new Products();
const cartModel = new Cart();
const customerModel = new Customer();


// Временные функции для тестирования функционала
/**
 * Вывод информации из корзины
 */
function logCartStatus(cart: Cart): void {
  console.log('\tКол-во товаров в корзине:', cart.getItemsCount());
  console.log('\tОбщая стоимость товаров в корзине:', cart.getItemsCost());
  console.log('\tТовары в корзине:', cart.getItems());
}

function addToCart(cart: Cart, item: IProduct | null): void {
  if (item) cart.addItem(item);
}

function validateCustomerData(customer: Customer, customerData: TField[]): void {
  console.log('\tОшибки валидации оплаты:', customer.validateData(customerData[0]) || 'Ошибок нет');
  console.log('\tОшибки валидации адреса:', customer.validateData(customerData[1]) || 'Ошибок нет');
  console.log('\tОшибки валидации емэйла:', customer.validateData(customerData[2]) || 'Ошибок нет');
  console.log('\tОшибки валидации номера телефона:', customer.validateData(customerData[3]) || 'Ошибок нет');
}


// Тестирование функционала
// получаем товары с сервера
const items = await dataService.getProducts();
// сохраняем товары в модель каталога
productsModel.setItems(items);
console.log('Массив товаров из каталога:', productsModel.getItems());

// Находим товар с id='90973ae5-285c-4b6f-a6d0-65d1d760b102'
let someItem = productsModel.getItemById('90973ae5-285c-4b6f-a6d0-65d1d760b102');
console.log('Товар с id=\"90973ae5-285c-4b6f-a6d0-65d1d760b102\":', someItem);

// сохраняем товар с id='412bcf81-7e75-4e70-bdb9-d3c73c9803b7' для подробного отображения
productsModel.setSelectedItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
let selectedItem = productsModel.getSelectedItem();
console.log('Выбранный товар для подробного отображения:', selectedItem);


// Добавляем товар с id='90973ae5-285c-4b6f-a6d0-65d1d760b102' в корзину:
console.log('Добавляем товар с id=\"90973ae5-285c-4b6f-a6d0-65d1d760b102\" в корзину');
addToCart(cartModel, someItem);
logCartStatus(cartModel);
console.log('\tТовар с id=\"90973ae5-285c-4b6f-a6d0-65d1d760b102\" в наличии?:', cartModel.isItemInCart('90973ae5-285c-4b6f-a6d0-65d1d760b102'));

// Добавляем выбранный товар для подробного отображения в корзину
console.log('Добавляем выбранный товар для подробного отображения в корзину');
addToCart(cartModel, selectedItem);
logCartStatus(cartModel);
console.log('\tВыбранный товар для отображения в наличии?:', cartModel.isItemInCart('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

// Удаляем товар с id='90973ae5-285c-4b6f-a6d0-65d1d760b102' из корзины:
console.log('Удаляем товар с id=\"90973ae5-285c-4b6f-a6d0-65d1d760b102\" из корзины');
cartModel.deleteItem('90973ae5-285c-4b6f-a6d0-65d1d760b102');
logCartStatus(cartModel);
console.log('\tТовар с id=\"90973ae5-285c-4b6f-a6d0-65d1d760b102\" в наличии?:', cartModel.isItemInCart('90973ae5-285c-4b6f-a6d0-65d1d760b102'));

// Очищаем корзину
console.log('Очищаем корзину');
cartModel.clearItems();
logCartStatus(cartModel);

// Данные покупателя:
const customerData: TField[] = [
  {
    type: 'PAYMENT',
    value: ''
  },
  {
    type: 'ADDRESS',
    value: ''
  },
  {
    type: 'EMAIL',
    value: ''
  },
  {
    type: 'PHONE',
    value: ''
  },
]
// Записываем в данные покупателя способ оплаты:
console.log('Устанавливаем тип оплаты')
customerData[0].value = 'CASH';
customerModel.setData(customerData[0]);
validateCustomerData(customerModel, customerData);
console.log('Данные покупателя:', customerModel.getData());

console.log('Устанавливаем адрес')
customerData[1].value = 'г. Москва, Кутузовский пр-кт, д. 32';
customerModel.setData(customerData[1]);
validateCustomerData(customerModel, customerData);
console.log('Данные покупателя:', customerModel.getData());

console.log('Устанавливаем емэйл')
customerData[2].value = 'test@mail.ru';
customerModel.setData(customerData[2]);
validateCustomerData(customerModel, customerData);
console.log('Данные покупателя:', customerModel.getData());

console.log('Устанавливаем номер телефона')
customerData[3].value = '+7 (999) 999-99-99';
customerModel.setData(customerData[3]);
validateCustomerData(customerModel, customerData);
console.log('Данные покупателя:', customerModel.getData());

// Очищаем данные покупателя
console.log('Очищаем данные покупателя')
customerModel.clearData();
console.log('Данные покупателя:', customerModel.getData());
