import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export abstract class Card<T extends IProduct> extends Component<T> {
  protected _id?: string;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  set price(value: number | null) {
    if (value) {
      this.setText(this.priceElement, `${value} синапсов`);
    } else {
      this.setText(this.priceElement, `Бесценно`);
    }
  }
}
