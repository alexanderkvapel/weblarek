import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface ISuccess {
  totalPrice: number;
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('modal:closed');
    });
  }

  set totalPrice(value: number) {
    this.setText(this.descriptionElement, `Списано ${value} синапсов`);
  }
}
