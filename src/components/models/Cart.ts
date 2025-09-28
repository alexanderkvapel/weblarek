import { IProduct } from '../../types/index.ts';

/**
 * Содержит в себе даные о товарах, которые пользователь выбрал для покупки и всю логику работы с ними.
 */
export default class Cart {
  private items: IProduct[] = [];

  constructor() {}

  /**
   * добавление товара, который был получен в параметре, в массив корзины
   * @param {IProduct} item объект товара
   */
  addItem(item: IProduct): void {
    this.items.push(item);
  }

  /**
   * удаление товара, полученного в параметре из массива корзины
   * @param {IProduct} item объект товара
   */
  deleteItem(item: IProduct): void {
    const itemToDelete = this.findItem(item);

    if (itemToDelete) {
      const indexOfItemToDelete = this.items.indexOf(itemToDelete);

      this.items.splice(indexOfItemToDelete, 1);
    }
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
   * @param {IProduct} item объект товара
   */
  isItemInCart(item: IProduct): boolean {
    return this.findItem(item) ? true : false;
  }

  /**
   * очистка корзины
   */
  clearItems(): void {
    this.items = [];
  }

  /**
   * поиск товара в items
   * @param {IProduct} item объект товара
   */
  private findItem(item: IProduct): IProduct | undefined {
    return this.items.find(currentItem => currentItem.id === item.id);
  }
}