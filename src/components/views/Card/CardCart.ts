import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card, ICard } from './Card';


export class CardCart extends Card<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => {
      this.events?.emit('card:delete-from-cart', { id: this.id });
      this.events?.emit('cart:open');
    })
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;
    
    return super.render(data);
  }
}
