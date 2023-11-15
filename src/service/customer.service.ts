import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entity/customer.entity';
import * as bcrypt from 'bcrypt';

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
  hashData(token: string) {
    return bcrypt.hash(token, 10);
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
    console.log('customers', this.customers);
  }
  createCustomer(phoneNumber: string): CustomerEntity {
    const customer = new CustomerEntity();
    customer.phone_number = phoneNumber;
    customer.customer_id = (this.customers.length + 1).toString();
    this.customers.push(customer);
    return customer;
  }
}
