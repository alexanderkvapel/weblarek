import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card, ICard } from './Card';
import { ensureElement } from '../../../utils/utils';


export class CardPreview extends Card<ICard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected inBasket: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      if (!this.id) return;

      this.inBasket = !this.inBasket;
      
      if (this.inBasket) {
        this.buttonElement.textContent = 'Удалить из корзины';
        this.events.emit('card:add-to-basket', { id: this.id });
      } else { 
        this.buttonElement.textContent = 'Купить';
        this.events.emit('card:delete-from-basket', { id: this.id });
      }

      this.events.emit('basket:counter-changed');
    });
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

  render(data: IProduct, inBasket = false): HTMLElement {
    this.id = data.id;
    this.category = data.category;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.image = data.image;
    this.inBasket = inBasket;

    if (this.price) {
      if (this.inBasket) this.buttonElement.textContent = 'Удалить из корзины';
      else this.buttonElement.textContent = 'Купить';
      this.buttonElement.disabled = false;
    } else {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    }

    return super.render(data);
  }
}
