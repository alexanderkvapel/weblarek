import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

/**
 * Содержит в себе даные о товарах, которые пользователь выбрал для покупки и всю логику работы с ними.
 */
export default class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  /**
   * добавление товара, который был получен в параметре, в массив корзины
   * @param {IProduct} item объект товара
   */
  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('cart:updated');
  }

  /**
   * удаление товара по его id, полученного в параметре из массива корзины.
   * @param {string} id идентификатор товара
   */
  deleteItem(id: string): void {
    const itemToDelete = this.findItem(id);

    if (itemToDelete) {
      const indexOfItemToDelete = this.items.indexOf(itemToDelete);

      this.items.splice(indexOfItemToDelete, 1);
    }

    this.events.emit('cart:updated');
  }

  /**
   * получение массива товаров, которые находятся в корзине
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * получение количества товаров в корзине
   */
  getItemsCount(): number {
    return this.items.length;
  }

  /**
   * получение стоимости всех товаров в корзине
   */
  getItemsCost(): number {
    const totalCost = this.items.reduce((accumulator, item) => {
      const price = item.price;

      if (price) {
        return accumulator + price
      } else {
        return accumulator;
      }
    }, 0);

    return totalCost;
  }

  /**
   * проверка наличия товара в корзине по его id, полученного в параметр метода
   * @param {string} id идентификатор товара
   */
  isItemInCart(id: string): boolean {
    return this.findItem(id) ? true : false;
  }

  /**
   * очистка корзины
   */
  clearItems(): void {
    this.items = [];

    this.events.emit('cart:updated');
  }

  /**
   * поиск товара в items
   * @param {string} id идентификатор товара
   */
  private findItem(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }
}
