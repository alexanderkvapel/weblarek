import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ICard } from './Card';


export class CardBasket extends Component<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);


  }

  set index(value: number) {

  }

  render(data: IProduct): HTMLElement {

  }
}
