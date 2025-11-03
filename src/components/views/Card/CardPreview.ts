import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { categoryMap } from "../../../utils/constants";
import { IProductCart } from '../../../types';


type CategoryKey = keyof typeof categoryMap;


export class CardPreview extends Card<IProductCart> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('card:button-clicked', { id: this._id });
    });
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach(key => {
      const className = categoryMap[key as CategoryKey];
      this.categoryElement.classList.toggle(className, key === value)
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    if (value) {
      this.priceElement.textContent = `${value} синапсов`;
      this.buttonElement.textContent = 'Купить';
      this.buttonElement.disabled = false;
    } else {
      this.priceElement.textContent = `Бесценно`;
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    }
  }

  set inCart(value: boolean) {
    if (value) {
      this.buttonElement.textContent = 'Удалить из корзины';
    }
  }
}
