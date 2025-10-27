import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface IHeader {
  counter: number;
}


export class Header extends Component<IHeader> {
  protected basketButtonElement: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButtonElement.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
