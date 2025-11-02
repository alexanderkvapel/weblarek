import { Component } from '../../base/Component';
import { IFormActions } from '../../../types';
import { ensureElement } from '../../../utils/utils';


export abstract class Form extends Component<{}> {
  protected errorMessageElement: HTMLElement;
  protected submitButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);

    this.errorMessageElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    if (actions?.onSubmit) {
      this.container.addEventListener('submit', (event) => {
        event.preventDefault();
        actions.onSubmit?.(event);
      });
    }
  }

  set errorMessage(value: string) {
    this.errorMessageElement.textContent = value;
  }

  set disableSubmitButton(value: boolean) {
    this.submitButtonElement.disabled = value;
  }

  clearErrorMessage(): void {
    this.errorMessageElement.textContent = '';
  }

  validate(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter((err) => err);

    if (errorMessages.length) {
      this.errorMessage = errorMessages.join(', ');
      this.disableSubmitButton = true;
    } else {
      this.clearErrorMessage();
      this.disableSubmitButton = false;
    }
  }
}
