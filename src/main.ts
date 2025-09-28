import './scss/styles.scss';

import { TPayment, TField, TFieldType } from './types/index.ts';

import Products from './components/models/Products.ts';
import Cart from './components/models/Cart.ts';
import Customer from './components/models/Customer.ts';

const productsModel = new Products();
const cartModel = new Cart();
const customerModel = new Customer();
