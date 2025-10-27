import { IEvents } from '../base/Events';
import { IProduct } from '../../../types';
import { Card, ICard } from './Card';


export class CardPreview extends Card<ICard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected inCart: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);


  }

  set image(src: string) {

  }

  set category(value: string) {

  }

  set description(value: string) {

  }

  render(data: IProduct, inCart = false): HTMLElement {
    
  }
}
