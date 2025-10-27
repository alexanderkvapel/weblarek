import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface IModal {
  content: HTMLElement;
}


export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButtonElement: HTMLButtonElement;
  protected pageElement: HTMLElement;
  protected isOpen = false;


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

  }

  set content(value: HTMLElement) {

  }

  open(): void {

  }

  close(): void {
    
  }
}
