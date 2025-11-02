import { Form } from './Form';
import { TPayment, IFormActions, IOrderActions } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';


export interface IFormOrderActions extends IFormActions, IOrderActions {};

export interface IOrder {
  payment: TPayment;
  address: string;
};


export class FormOrder extends Form {
  protected payByCardElement: HTMLButtonElement;
  protected payByCashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormOrderActions, protected events?: IEvents) {
    super(container, actions);

    this.payByCardElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.payByCashElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.payByCardElement.addEventListener('click', () => {
      this.selectPaymentMethod('CARD');

      if (actions?.onPaymentMethodSelect) actions.onPaymentMethodSelect('CARD');
    });

    this.payByCashElement.addEventListener('click', () => {
      this.selectPaymentMethod('CASH');

      if (actions?.onPaymentMethodSelect) actions.onPaymentMethodSelect('CASH');
    });

    this.addressElement.addEventListener('input', () => {
      if (actions?.onAddressInput) actions.onAddressInput(this.addressElement.value);
    });

    this.submitButtonElement.addEventListener('click', () => {
      this.events?.emit('order:contacts');
    });
  }

  set paymentMethod(value: TPayment) {
    this.selectPaymentMethod(value);
  }

  get paymentMethod(): TPayment {
    if (this.payByCardElement.classList.contains('button_alt-active')) return 'CARD';
    else return 'CASH';
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

  get address(): string {
    return this.addressElement.value;
  }

  get orderData(): IOrder {
    return {
      payment: this.paymentMethod,
      address: this.address,
    }
  }

  selectPaymentMethod(payment: TPayment): void {
    this.payByCardElement.classList.toggle('button_alt-active', payment === 'CARD');
    this.payByCashElement.classList.toggle('button_alt-active', payment === 'CASH');
  }

  validateOrder(errors?: Record<string, string>): void {
    this.validate(errors || {});
  }
}
