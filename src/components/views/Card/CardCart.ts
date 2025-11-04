import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card } from './Card';

export class CardCart extends Card<IProduct> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => {
      this.events.emit('card:delete-from-cart', { id: this._id });
    })
  }

  set index(value: number) {
    this.setText(this.indexElement, String(value));
  }
}
