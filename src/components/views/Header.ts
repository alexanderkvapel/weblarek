import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface IHeader {
  counter: number;
}


export class Header extends Component<IHeader> {
  protected cartButtonElement: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cartButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.cartButtonElement.addEventListener('click', () => {
      this.events.emit('cart:clicked');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
