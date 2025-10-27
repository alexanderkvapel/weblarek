import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


interface IBasket {
  items: HTMLElement[];
  totalPrice: number;
}


export class Basket extends Component<IBasket> {
  protected titleElement: HTMLElement;
  protected itemsElement: HTMLElement;
  protected totalPriceElement: HTMLElement;
  protected orderButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);


  }

  set orderButtonText(value: string) {

  }

  set disableOrderButton(value: boolean) {

  }

  set items(items: HTMLElement[]) {

  }

  set totalPrice(value: number) {

  }
}
