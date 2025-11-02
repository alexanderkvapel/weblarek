import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface ICart {
  items: HTMLElement[];
  totalPrice: number;
}


export class Cart extends Component<ICart> {
  protected titleElement: HTMLElement;
  protected itemsElement: HTMLElement;
  protected totalPriceElement: HTMLElement;
  protected orderButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.modal__title', this.container);
    this.itemsElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButtonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButtonElement.addEventListener('click', () => {
      this.events?.emit('order:order');
    });
  }

  set orderButtonText(value: string) {
    this.orderButtonElement.textContent = value;
  }

  set disableOrderButton(value: boolean) {
    this.orderButtonElement.disabled = value;
  }

  set items(items: HTMLElement[]) {
    this.orderButtonText = 'Оформить';

    if (items.length) {
      this.disableOrderButton = false;
      this.itemsElement.replaceChildren(...items);
    } else {
      const elementForEmptyBasket = document.createElement('p')
                                            .textContent = 'Корзина пуста';
      
      this.disableOrderButton = true;
      this.itemsElement.replaceChildren(elementForEmptyBasket);
    }
  }

  set totalPrice(value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }
}
