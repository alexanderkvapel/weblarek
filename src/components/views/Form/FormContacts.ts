import { IFormActions, IContactsActions } from '../../../types/index';
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
  }

  set email(value: string) {

  }

  get email(): string {

  }

  set phone(value: string) {

  }

  get phone(): string {

  }

  get contactsData(): IContactsData {

  }

  validate(): void {

  }
}
