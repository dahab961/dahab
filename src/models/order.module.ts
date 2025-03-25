import { OrderDto } from "../dto/order.dto";

export class Order {
    orderNumber: string;
    customerNO: string;
    folderLink: string;
    orderDate: Date | null;
    status: string;
    notes?: string;
    image?: string;

    constructor(orderDto: OrderDto) {
        this.orderNumber = orderDto.orderNumber;
        this.customerNO = orderDto.customerNO;
        this.folderLink = orderDto.folderLink;
        this.orderDate = orderDto.orderDate ? new Date(orderDto.orderDate) : null;
        this.status = orderDto.status;
        this.notes = orderDto.notes;
        this.image = orderDto.image;
    }

    // Convert back to DTO format
    toDto(): OrderDto {
        return {
            orderNumber: this.orderNumber,
            customerNO: this.customerNO,
            folderLink: this.folderLink,
            orderDate: this.orderDate ? this.orderDate.toISOString() : undefined,
            status: this.status,
            notes: this.notes,
            image: this.image,
        };
    }

    static fromGSheet(record: OrderDto): Order {
        return new Order({
            orderNumber: record.orderNumber,  // Map fields from OrderDto to Order class
            customerNO: record.customerNO,
            folderLink: record.folderLink,
            orderDate: record.orderDate ? new Date(record.orderDate).toISOString() : undefined,  // Handle date parsing
            status: record.status || '',  
            notes: record.notes || undefined,  // Default to undefined if notes are missing
            image: record.image || undefined,  // Default to undefined if image is missing
        });
    }
}
