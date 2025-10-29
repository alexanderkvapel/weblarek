import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card, ICard } from './Card';


export class CardBasket extends Card<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => {
      this.events?.emit('card:delete-from-basket', { id: this.id });
      this.events?.emit('basket:counter-changed');
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
