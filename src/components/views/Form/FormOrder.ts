import { Form } from './Form';
import { TPayment, IFormActions, IOrderActions } from '../../../types';


export interface IFormOrderActions extends IFormActions, IOrderActions {};

export interface IOrderData {
  payment: TPayment;
  address: string;
};


export class FormOrder extends Form {
  protected payByCardElement: HTMLButtonElement;
  protected payByCashElement: HTMLButtonElement;
  protected addressElement: HMTLInputElement;

  constructor(container: HTMLElement, actions?: IFormOrderActions, protected events?: IEvents) {
    super(container, actions);


  }

  set paymentMethod(value: TPayment) {

  }

  get paymentMethod(): TPayment {

  }

  set address(value: string) {

  }

  get address(): string {

  }

  get orderData(): IOrderData {

  }

  selectPaymentMethod(payment: TPayment): void {

  }

  validateAddress(errors?: {[key: string]: string}): void {
    
  }
}
