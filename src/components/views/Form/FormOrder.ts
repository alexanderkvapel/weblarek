import { Form } from './Form';
import { TPayment, IFormActions, IOrderActions } from '../../../types';
import { ensureElement } from '../../../utils/utils';


export interface IFormOrderActions extends IFormActions, IOrderActions {};

export interface IOrder {
  payment: TPayment;
  address: string;
};


export class FormOrder extends Form {
  protected payByCardElement: HTMLButtonElement;
  protected payByCashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormOrderActions) {
    super(container, actions);

    this.payByCardElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.payByCashElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.payByCardElement.addEventListener('click', () => {
      this.selectPaymentMethod('CARD', actions?.onPaymentSelect);
    });

    this.payByCashElement.addEventListener('click', () => {
      this.selectPaymentMethod('CASH', actions?.onPaymentSelect);
    });

    this.addressElement.addEventListener('input', () => {
      if (actions?.onInput) actions.onInput?.('address', this.addressElement.value);
    });
  }

  set paymentMethod(value: TPayment) {
    this.selectPaymentMethod(value);
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

  selectPaymentMethod(payment: TPayment, callback?: (payment: TPayment) => void): void {
    this.payByCardElement.classList.toggle('button_alt-active', payment === 'CARD');
    this.payByCashElement.classList.toggle('button_alt-active', payment === 'CASH');

    callback?.(payment);
  }
}
