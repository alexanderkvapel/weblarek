import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface IModal {
  content: HTMLElement | null;
  isOpen?: boolean;
}


export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButtonElement.addEventListener('click', () => {
      this.events.emit('modal:closed');
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) this.events.emit('modal:closed');
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }

  set isOpen(value: boolean) {
    if (value) {
      this.container.classList.add('modal_active');
    } else {
      this.container.classList.remove('modal_active');
    }
  }
}
