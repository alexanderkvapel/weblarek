import { IFormActions, IContactsActions } from '../../../types/index';
import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';

export interface IFormContactsActions extends IFormActions, IContactsActions {};

export interface IContacts {
    email: string;
    phone: string;
}

export class FormContacts extends Form {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormContactsActions) {
    super(container, actions);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    if (actions?.onInput) {
      this.emailElement.addEventListener('input', () => {
        actions.onInput?.('email', this.emailElement.value);
      })

      this.phoneElement.addEventListener('input', () => {
        actions.onInput?.('phone', this.phoneElement.value);
      })
    }
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }
}
