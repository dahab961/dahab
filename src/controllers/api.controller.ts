import { FastifyRequest, FastifyReply } from "fastify";
import { GoogleSheetsApi } from "../services/googleSheetsApi.service";
import { Category } from "../models/category.module";
import { Product } from "../models/product.module";
import { Order } from "../models/order.module";
import { MaterialDTO } from "../dto/material.dto";
import { OrderDto } from "../dto/order.dto";
import { CustomerDTO } from "../dto/customers.dto";

export const DEFAULT_MATERIAL_IMG = "/images/material.webp";
export const DEFAULT_PRODUCT_IMG = "/images/product.webp";
export type OrderIdParam = {
    Params: { orderId: string }
};


export const getOrderById = async (
    req: FastifyRequest<OrderIdParam>,
    res: FastifyReply
) => {
    let orderId = req.params.orderId;
    let error: string | null = null;
    let order: Order | null = null;
    let status = 200;

    try {
        if (!orderId) throw new Error("Invalid order ID");

        const orderDto = await GoogleSheetsApi.getOrderById(orderId);
        if (!orderDto) throw new Error("Order not found");

        order = Order.fromGSheet(orderDto);

    } catch (err) {
        error = (err as Error).message;
        status = 500;
        console.error(err);
    }

    return res.status(status).send({
        order,
        error,
    });
};


export const products = async (
    req: FastifyRequest<{ Params: { categoryId: string } }>,
    seo: any,
    res: FastifyReply
) => {
    const categoryId = req.params.categoryId;

    let error: string | null = null;
    let products: Product[] = [];
    let category: Category | null = null;
    let status = 200;

    try {
        if (!categoryId) throw new Error("Invalid category ID");

        const categoryData = await GoogleSheetsApi.getCategoryById(categoryId);
        if (!categoryData) throw new Error("Category not found");

        category = {
            code: categoryData.code,
            name: categoryData.name,
            link: '',
            image: categoryData.image || DEFAULT_PRODUCT_IMG
        };

        products = await GoogleSheetsApi.getProducts(categoryId) || [];

    } catch (err) {
        error = (err as Error).message;
        status = 500;
        console.error(err);
    }

    return res.status(status).send({
        category,
        products,
        error,
    });
};

export const orders = async (
    req: FastifyRequest,
    seo: any,
    res: FastifyReply
) => {

    let error: string | null = null;
    let orders: Order[] = [];
    let status = 200;

    try {
        const ordersDto = await GoogleSheetsApi.getOrders() || [];
        orders = ordersDto.map(order => Order.fromGSheet(order));

    } catch (err) {
        error = (err as Error).message;
        status = 500;
        console.error(err);
    }

    const response: { orders: Order[]; error?: string } = { orders };
    if (error) {
        response.error = error;
    }
    return res.status(status).send(response);
};


export const materials = async (
    req: FastifyRequest,
    seo: any,
    res: FastifyReply
) => {
    let error: string | null = null;
    let materials: MaterialDTO[] = [];
    let status = 200;

    try {
        materials = await GoogleSheetsApi.getMaterials() || [];
    } catch (err) {
        error = (err as Error).message;
        status = 500;
        console.error(err);
    }
    const response: { materials: MaterialDTO[]; error?: string } = { materials };
    if (error) {
        response.error = error;
    }
    return res.status(status).send(response);
};


export const customers = async (
    req: FastifyRequest,
    seo: any,
    res: FastifyReply
) => {
    let error: string | null = null;
    let customers: CustomerDTO[] = [];
    let status = 200;

    try {
        customers = await GoogleSheetsApi.getCustomers() || [];
    } catch (err) {
        error = (err as Error).message;
        status = 500;
        console.error(err);
    }
    const response: { customers: CustomerDTO[]; error?: string } = { customers };
    if (error) {
        response.error = error;
    }
    return res.status(status).send(response);
};

