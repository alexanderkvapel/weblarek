import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';


interface ICatalog {
  catalog: HTMLElement[];
}


export class Catalog extends Component<ICatalog> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
