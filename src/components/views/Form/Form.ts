import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';


export abstract class Form extends Component<{}> {
  protected errorMessageElement: HTMLElement;
  protected submitButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.errorMessageElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:submit`);
    });
  }

  set errorMessage(value: string) {
    this.errorMessageElement.textContent = value;
  }

  set disableSubmitButton(value: boolean) {
    this.submitButtonElement.disabled = value;
  }

  validate(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter((err) => err);

    if (errorMessages.length) {
      this.errorMessage = errorMessages.join(', ');
      this.disableSubmitButton = true;
    } else {
      this.errorMessage = '';
      this.disableSubmitButton = false;
    }
  }
}
