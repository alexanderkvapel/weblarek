export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Методы оплаты заказа
export type TPayment = 'CARD' | 'CASH' | '';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>; // GET Request
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>; // POST Request
}

// Продукт
export interface IProduct {
    id: string; // идентификатор
    title: string; // наименование
    description: string; // описание
    price: number | null; // цена может отсутствовать
    category: string; // категория
    image: string; // изображение
}

// Данные покупателя
export interface ICustomer {
    payment: TPayment; // тип оплаты
    address: string; // адрес
    email: string; // емэйл
    phone: string; // номер телефона
}

// Ответ сервера на запрос на ендпоинт /product/
export interface IProductResponse {
    total: number; // количество полученных товаров
    items: IProduct[]; // товары
}

// Запрос серверу на запрос на ендпоинт /order/
export interface IOrderRequest extends ICustomer {
    total: number; // общая стоимость товаров
    items: string[]; // товары
}

// Ответ сервера на запрос на ендпоинт /order/
export interface IOrderResponse {
    id: string; // идентификатор ответа
    total: number; // общая стоимость товаров
}
