import { Injectable } from '@nestjs/common';
import { Customer } from 'src/entity/customer.entity';
import * as bcrypt from 'bcrypt';
import * as MyLib from 'src/libs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findOneByPhone(phoneNumber: string): Promise<Customer | null> {
    return await this.customerRepo.findOneBy({ phone_number: phoneNumber });
  }
  async findOneById(id: number): Promise<Customer | null> {
    return await this.customerRepo.findOneBy({
      customer_id: id,
    });
  }
  async hashData(token: string) {
    // return await bcrypt.hash(token, 10);
    return MyLib.hash(token);
  }
  async updateRefreshTokenByPhone(phoneNumber: string, refToken: string) {
    if (!refToken) {
      const customer = await this.findOneByPhone(phoneNumber);
      await this.customerRepo.update(customer.customer_id, {
        refresh_token: null,
      });
    }
    const hashedToken = await this.hashData(refToken);
    const customer = await this.findOneByPhone(phoneNumber);

    //save customer
    return await this.customerRepo.update(customer.customer_id, {
      refresh_token: hashedToken,
    });
  }
  async createCustomer(phoneNumber: string): Promise<Customer> {
    //check if customer does exist
    const existingCustomer = await this.findOneByPhone(phoneNumber);
    if (existingCustomer) {
      return existingCustomer;
    }

    //if customer does not exit, create new customer with phoneNumber
    const customer = new Customer();
    customer.phone_number = phoneNumber;
    return await this.customerRepo.save(customer);
  }
}
