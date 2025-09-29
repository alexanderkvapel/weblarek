import { TPayment, ICustomer, TField } from '../../types/index.ts';

/**
 * Содержит данные покупателя, которые тот должен указать при оформлении заказа, логику для работы с ними и их обработки.
 */
export default class Customer {
  private payment: TPayment = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor() {}

  /**
   * получение всех данных покупателя
   */
  getData() : ICustomer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  /**
   * сохранение данных в модели
   * @param {TField[] | TField} fields объект, содержащий свойства: тип поля TFieldType и значение поля или массив таких объектов
   */
  setData(fields: TField[] | TField): void {
    if (Array.isArray(fields)) {
      fields.forEach(field => this.setValue(field));
    } else {
      this.setValue(fields);
    } 
  }

  /**
   * очистка данных покупателя
   */
  clearData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  /**
   * валидация данных
   * @param {TField} field объект, содержащий свойства: тип поля TFieldType и значение поля
   */
  validateData(field: TField): string {
    if (!field.value) {
      switch (field.type) {
        case 'PAYMENT':
          return 'Не выбран вид оплаты';
        case 'ADDRESS':
          return 'Укажите адрес';
        case 'EMAIL':
          return 'Укажите емэйл';
        case 'PHONE':
          return 'Укажите телефон';
      }
    } else {
      return '';
    }
  }

  /**
   * присваивает значение в поле
   * @param {TField} field объект, содержащий свойства: тип поля TFieldType и значение поля
   */
  private setValue(field: TField): void {
    const type = field.type;
    const value = field.value;

    switch (type) {
      case 'PAYMENT':
        this.payment = value as TPayment;
        break;
      case 'ADDRESS':
        this.address = value;
        break;
      case 'EMAIL':
        this.email = value;
        break;
      case 'PHONE':
        this.phone = value;
        break;
    }
  }
}