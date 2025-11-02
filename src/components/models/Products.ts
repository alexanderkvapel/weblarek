import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

/**
 * Содержит в себе данные о товарах, которые можно купить в приложении и всю логику работы с ними.
 */
export default class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  /**
   * сохранение массива товаров полученного в параметрах метода
   */
  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit('gallery:changed');
  }

  /**
   * получение массива товаров из модели
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * сохранение товара для подробного отображения
   * @param {string} id идентификатор товара
   */
  setSelectedItem(id: string): void {
    this.selectedItem = this.getItemById(id);
  }

  /**
   * получение товара для подробного отображения
   */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }

  /**
   * получение одного товара по его id
   * @param {string} id идентификатор товара
   */
  getItemById(id: string): IProduct | null {
    const result = this.items.find(item => item.id === id);

    return result ? result : null;
  }
}
