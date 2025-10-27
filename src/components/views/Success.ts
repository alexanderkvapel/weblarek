import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

export interface ISpent {
  total: number;
}

export class Success extends Component<ISpent> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    
  }

  set totalPrice(value: number) {

  }
}
