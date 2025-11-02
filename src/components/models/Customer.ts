import { TPayment, ICustomer } from '../../types/index.ts';

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
   * @param {Record<string, string>} fields объект, содержащий пару(ы) название и значение поля
   */
  setData(fields: Record<string, string>): void {
    Object.assign(this as object, fields);
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
   * @returns {Record<string, string>} объект, содержащий пару(ы) название поля и ошибка валидации для него, если имеется
   */
  validateData(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (this.payment.trim() === '') errors['payment'] = 'Не выбран вид оплаты';
    if (this.address.trim() === '') errors['address'] = 'Укажите адрес';
    if (this.email.trim() === '') errors['email'] = 'Укажите емэйл';
    if (this.phone.trim() === '') errors['phone'] = 'Укажите телефон';

    return errors;
  }
}
