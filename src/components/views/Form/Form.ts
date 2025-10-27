import { Component } from '../../base/Component';
import { IFormActions } from '../../../types';


export abstract class Form extends Component<{}> {
  protected errorMessageElement: HTMLElement;
  protected submitButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);


  }

  set errorMessage(value: string) {

  }

  set disableSubmitButton(value: boolean) {

  }

  clearErrorMessage(): void {

  }

  validate(errors: {[key: string]: string}): void {
    
  }
}
