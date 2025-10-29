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

    this.emailElement.addEventListener('input', () => {
      if (actions?.onEmailInput) actions.onEmailInput(this.emailElement.value);
    });

    this.phoneElement.addEventListener('input', () => {
      if (actions?.onPhoneInput) actions.onPhoneInput(this.phoneElement.value);
    });
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  get email(): string {
    return this.emailElement.value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  get phone(): string {
    return this.phoneElement.value;
  }

  get contactsData(): IContacts {
    return {
      email: this.email,
      phone: this.phone,
    }
  }

  validateContacts(errors?: {[key: string]: string}): void {
    this.validate(errors || {});
  }
}
