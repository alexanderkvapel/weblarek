import { ensureElement } from '../../../utils/utils';
import { Card, ICard } from './Card';


interface ICartActions {
  onDelete?: (event: MouseEvent) => void;
}


export class CardCart extends Card<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICartActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButtonElement.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
