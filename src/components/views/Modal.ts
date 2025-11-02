import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';


interface IModal {
  content: HTMLElement;
}

interface IModalActions {
  onClose?: () => void;
}


export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButtonElement: HTMLButtonElement;


  constructor(container: HTMLElement, actions?: IModalActions) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButtonElement.addEventListener('click', () => this.close(actions?.onClose));

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) this.close(actions?.onClose);
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(content?: HTMLElement): void {
    if (content) this.contentElement.replaceChildren(content);

    this.container.classList.add('modal_active');
    document.body.style.overflow = "hidden";
  }

  close(callback?: () => void) {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = "auto";

    callback?.();
  }
}
