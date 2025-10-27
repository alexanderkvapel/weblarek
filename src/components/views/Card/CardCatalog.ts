import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../../types';
import { categoryMap } from "../../../utils/constants";


export type TCardCatalog = Pick <IProduct, 'id' | 'title' | 'image' | 'category'>;

type CategoryKey = keyof typeof categoryMap;


export class Basket extends Component<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);


  }

  set image(src: string) {

  }

  set category(value: string) {

  }

  render(data: TCardCatalog): HTMLElement {
    
  }
}
