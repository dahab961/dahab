import { CustomerDTO } from "../dto/customers.dto";

export class Customer {
    customerNO: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  
    constructor(
      customerNO: string,
      firstName: string,
      lastName: string,
      phone: string,
      email: string,
      address: string
    ) {
      this.customerNO = customerNO;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;
      this.email = email;
      this.address = address;
    }
  
    static fromDTO(dto: CustomerDTO): Customer {
      return new Customer(
        dto.customerNO,
        dto.firstName,
        dto.lastName,
        dto.phone,
        dto.email,
        dto.address
      );
    }
  
    static fromGSheet(record: any[]): Customer {
      return new Customer(
        record[0].toString(),
        record[1].toString(),
        record[2].toString(),
        record[3].toString(),
        record[4].toString(),
        record[5].toString()
      );
    }
  
    toDTO(): CustomerDTO {
      return {
        customerNO: this.customerNO,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        address: this.address,
      };
    }
  }
  