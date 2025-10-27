import { IProduct } from '../../../types';
import { Component } from '../../base/Component';


export interface ICard extends Partial<IProduct> {
  index?: number;
}


export abstract class Card<T extends ICard> extends Component<T> {
  protected id?: number;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    
  }

  set title(value: string) {

  }

  set price(value: number | null) {

  }
}
