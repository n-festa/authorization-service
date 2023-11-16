import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entity/customer.entity';
import * as bcrypt from 'bcrypt';
import * as MyLib from 'src/libs';

@Injectable()
export class CustomerService {
  private readonly customers: CustomerEntity[] = [];
  async findOneByPhone(phoneNumber: string): Promise<CustomerEntity | null> {
    //find customer by phone number
    return (
      this.customers.find(
        (customer) => customer.phone_number === phoneNumber,
      ) || null
    );
  }
  async findOneById(id: number): Promise<CustomerEntity | null> {
    return this.customers[id - 1] || null;
  }
  async hashData(token: string) {
    // return await bcrypt.hash(token, 10);
    return MyLib.hash(token);
  }
  async updateRefreshTokenByPhone(phoneNumber: string, refToken: string) {
    if (!refToken) {
      const customer = await this.findOneByPhone(phoneNumber);
      const saveEntity = { ...customer, refresh_token: null };
      //save customer
      return this.saveCustomer(saveEntity);
    }

    const hashedToken = await this.hashData(refToken);

    const customer = await this.findOneByPhone(phoneNumber);
    const saveEntity = { ...customer, refresh_token: hashedToken };
    //save customer
    return this.saveCustomer(saveEntity);
  }
  saveCustomer(saveEntity: CustomerEntity) {
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].phone_number == saveEntity.phone_number) {
        this.customers[i] = saveEntity;
        break;
      }
    }
  }
  createCustomer(phoneNumber: string): CustomerEntity {
    const customer = new CustomerEntity();
    customer.phone_number = phoneNumber;
    customer.customer_id = (this.customers.length + 1).toString();
    this.customers.push(customer);
    return customer;
  }
}
