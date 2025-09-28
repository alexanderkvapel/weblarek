export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'CARD' | 'CASH' | '';

export type TFieldType = 'PAYMENT' | 'ADDRESS' | 'EMAIL' | 'PHONE';

export type TField = {
  type: TFieldType,
  value: TPayment | string,
};

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string,
    title: string,
    description: string,
    price: number | null,
    category: string,
    image: string,
}

export interface ICustomer {
    payment: TPayment,
    address: string,
    email: string,
    phone: string,
}
