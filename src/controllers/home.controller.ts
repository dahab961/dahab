'use strict';
import { GoogleSheetsApi } from "../services/googleSheetsApi.service";
import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/view";
import { CategoryDTO } from "../dto/category.dto";
import { Order } from "../models/order.module";
const INVALID_CATEGORY_ID = "מזהה קטגוריה לא תקין",
    MISSING_CATEGORY_ID = "חסר מזהה קטגוריה",
    INVALID_ORDER_ID = "מזהה הזמנה לא תקין";

export interface ProductsQuery {
    search?: string;
}
export type OrderParam = FastifyRequest<{ Params: { orderId: string } }>;

const home = (request: FastifyRequest, seo: any, reply: FastifyReply): FastifyReply => {
    const cards = [
        { link: "/materials", img: "/images/materials.webp", title: "חומרי גלם" },
        { link: "/products", img: "/images/product.webp", title: "מוצרים" },
        { link: "/orders", img: "/images/image.webp", title: "הזמנות" },
        { link: "/customers", img: "/images/customers.png", title: "לקוחות" }
    ];

    return defaultRes(request, seo, reply, "index", { cards });
}


const customers = (request: FastifyRequest, seo: any, reply: FastifyReply): FastifyReply =>
    defaultRes(request, seo, reply, "customers");

const materials = (request: FastifyRequest, seo: any, reply: FastifyReply): FastifyReply =>
    defaultRes(request, seo, reply, "materials");


const orders = (request: FastifyRequest, seo: any, reply: FastifyReply): FastifyReply =>
    defaultRes(request, seo, reply, "orders/index");

const categories = async (req: FastifyRequest, seo: any, res: FastifyReply): Promise<void> => {
    let error: string | null = null;
    let categories: CategoryDTO[] = [];
    try {
        categories = await GoogleSheetsApi.getCategories();
    } catch (err: any) {
        error = err.message;
        console.log(err);
    }
    return res.view("/pages/products/categories.hbs", {
        categories: categories,
        error: error,
        seo: seo,
    });
};

const order = async (
    req: FastifyRequest<{ Params: { orderId: string } }>,
    seo: any,
    res: FastifyReply
) => {
    return res.view("/pages/orders/order-details.hbs", {
        seo,
        orderId: req.params.orderId,
    });
};




const products = async (req: FastifyRequest<{ Params: { categoryId: string }; Query: ProductsQuery }>, seo: any, res: FastifyReply): Promise<FastifyReply> => {
    let categoryId = req.params.categoryId;
    let searchQuery: string = (req.query as ProductsQuery).search || "";
    let error: string | null = null;
    let category: CategoryDTO | null = null;
    try {
        if (!categoryId) { throw new CustomException(MISSING_CATEGORY_ID); }
        category = (await GoogleSheetsApi.getCategoryById(categoryId)) || null;
        if (!category)
            throw new CustomException(INVALID_CATEGORY_ID);
    }
    catch (err: any) {
        if (err instanceof CustomException) {
            error = err.message;
            console.log(err);
        } else {
            error = 'אירעה שגיאה';
            console.log(err);
        }
    }
    return res.view("/pages/products/products.hbs", {
        category: category,
        searchQuery: searchQuery,
        // products: products,
        error: error,
        seo: seo,
    });
}
function defaultRes(
    request: FastifyRequest,
    seo: any,
    reply: FastifyReply,
    name: string,
    params: Record<string, any> = {}
): FastifyReply {
    return reply.view(`/pages/${name}.hbs`, { seo, ...params });
}


class CustomException extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = "CustomException";
        this.statusCode = statusCode;
    }
}

export { CustomException };

export {
    home,
    orders,
    categories,
    products,
    customers,
    materials, order
};
