import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';

export class FormContacts extends Form {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailElement.addEventListener('input', () => {
      this.events.emit('email:chosen', { value: this.emailElement.value });
    });

    this.phoneElement.addEventListener('input', () => {
      this.events.emit('phone:chosen', { value: this.phoneElement.value });
    });
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  reset(): void {
    this.email = '';
    this.phone = '';
    this.errorMessage = '';
    this.disableSubmitButton = true;
  }
}
