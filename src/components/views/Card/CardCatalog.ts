import { IProduct } from '../../../types';
import { categoryMap } from "../../../utils/constants";
import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';


export type TCardCatalog = Pick <IProduct, 'id' | 'title' | 'image' | 'category'>;

type CategoryKey = keyof typeof categoryMap;


interface IGalleryActions {
  onClick?: (event: MouseEvent) => void;
}


export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IGalleryActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach(key => {
      const className = categoryMap[key as CategoryKey];
      this.categoryElement.classList.toggle(className, key === value)
    });
  }
}
