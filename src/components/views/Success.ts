import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    if (actions?.onOrdered) {
      this.buttonElement.addEventListener('click', actions.onOrdered);
    }
  }

  set totalPrice(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
