import { IApi, IProduct, IProductResponse, IOrderRequest, IOrderResponse } from '../../types/index.ts';

export default class DataService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * выполняет запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров.
   * @returns {Promise<IProduct[]>} массив товаров
   */
  async getProducts(): Promise<IProduct[]> {
    try {
      const response: IProductResponse = await this.api.get('/product/');

      return response.items;
    } catch (error) {
      let errorMessage = 'Ошибка при получении товаров с сервера'
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * отправляет на сервер данные о покупателе и выбранных товарах.
   * @param {IOrderRequest} items массив товаров к покупке 
   * @returns {Promise<IPostResponse>} 
   */
  async postOrder(items: IOrderRequest): Promise<IOrderResponse> {
    try {
      const orderResponse: IOrderResponse = await this.api.post('/order/', items);

      return orderResponse;
    } catch (error) {
      let errorMessage = 'Ошибка при отправке заказа на сервер'
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      throw new Error(errorMessage);
    }
  }
}