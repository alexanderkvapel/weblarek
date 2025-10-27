import { Component } from '../base/Component';


interface ICatalog {
  catalog: HTMLElement[];
}


export class Gallary extends Component<ICatalog> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);


  }

  set catalog(value: HTMLElement[]) {
    
  }
}
