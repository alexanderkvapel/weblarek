import { Form } from './Form';
import { TPayment } from '../../../types';
import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';


export interface IOrder {
  payment: TPayment;
  address: string;
};


export class FormOrder extends Form {
  protected paymentMethodElements: HTMLButtonElement[];
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.paymentMethodElements = ensureAllElements<HTMLButtonElement>('button[name]', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentMethodElements.forEach(element => {
      element.addEventListener('click', () => {
        const chosenPaymentMethod = element.getAttribute('name')?.toUpperCase() as TPayment;
        this.events.emit('payment:chosen', { value: chosenPaymentMethod });
      })
    })

    this.addressElement.addEventListener('input', () => {
      this.events.emit('address:chosen', { value: this.addressElement.value });
    });
  }

  set paymentMethod(value: TPayment) {
    this.paymentMethodElements.forEach(element => {
      element.classList.remove('button_alt-active');

      if (element.getAttribute('name') === value.toLowerCase()) {
        element.classList.add('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

  reset(): void {
    this.paymentMethod = '';
    this.address = '';
    this.errorMessage = '';
    this.disableSubmitButton = true;
  }
}
