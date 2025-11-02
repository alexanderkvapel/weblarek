import { Card, ICard } from './Card';
import { ensureElement } from '../../../utils/utils';


interface IPreviewActions {
  onClick?: (event: MouseEvent) => void;
}


export class CardPreview extends Card<ICard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IPreviewActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCart(value: boolean) {
    if (!this._price) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    } else {
      if (value) this.buttonElement.textContent = 'Удалить из корзины';
      else this.buttonElement.textContent = 'Купить';
      this.buttonElement.disabled = false;
    }
  }
}
