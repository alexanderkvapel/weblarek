import { ensureElement } from '../../utils/utils';
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

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.pageElement = ensureElement<HTMLElement>('.page__wrapper');

    this.closeButtonElement.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) this.close();
    });

    document.addEventListener('keydown', (event) => {
      if (this.isOpen && event.key === 'Escape') this.close();
    })
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.pageElement.classList.add('page__wrapper_locked');
    this.container.classList.add('modal_active');
    this.isOpen = true;

    this.events.emit('modal:open');
  }

  close(): void {
    this.pageElement.classList.remove('page__wrapper_locked');
    this.container.classList.remove('modal_active');
    this.isOpen = false;

    this.events.emit('modal:close');
  }
}
