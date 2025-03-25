// src/services/googleSheetsApi.ts
import { CategoryDTO } from "../dto/category.dto";
import { google } from "googleapis";
import dotenv from "dotenv";
import { ProductDTO } from "../dto/product.dto";
import { OrderDto } from "../dto/order.dto";
import { DEFAULT_PRODUCT_IMG } from '../controllers/api.controller'
import { Product } from "../models/product.module";
import { Order } from "../models/order.module";
import { MaterialDTO } from "../dto/material.dto";
import { CustomerDTO } from "../dto/customers.dto";
import { Customer } from "../models/customer.module";

dotenv.config();

if (!process.env.GOOGLE_CONFIG) {
  throw new Error("Environment variable GOOGLE_CONFIG is not defined");
}

const GOOGLE_CONFIG = JSON.parse(process.env.GOOGLE_CONFIG);

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: GOOGLE_CONFIG.project_id,
    private_key: GOOGLE_CONFIG.private_key.replace(/\\n/g, "\n"),
    client_email: GOOGLE_CONFIG.client_email,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = GOOGLE_CONFIG.sheet_id;
const CATEGORIES_SHEET_NAME = "קטגוריות";
const CUSTOMERS_SHEET_NAME = "לקוחות";
const PRODUCTS_SHEET_NAME = "מוצרים";
const MATERIALS_SHEET_NAME = "חומרי גלם";
const ORDERS_SHEET_NAME = "הזמנות";

export const GoogleSheetsApi = {
  async getCategories(): Promise<CategoryDTO[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: CATEGORIES_SHEET_NAME,
    });
    let data = this.getData({ values: response.data.values || undefined }) || []; // Skip the header row

    return data.map((category) => ({
      code: category[0],
      name: category[1],
      link: category[2],
      image: category[3],
    }));
  },

  async getCustomers(): Promise<CustomerDTO[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: CUSTOMERS_SHEET_NAME,
    });
    let data = this.getData({ values: response.data.values || undefined }) || [];

    return data.map((customer) => Customer.fromGSheet(customer));
  },

  async saveCategory(category: CategoryDTO): Promise<CategoryDTO> {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: CATEGORIES_SHEET_NAME,
      valueInputOption: "RAW",
      requestBody: {
        values: [[category.code, category.name, category.link, category.image || ""]],
      },
    });

    return category;
  },

  async getCategoryById(categoryId: string): Promise<CategoryDTO | undefined> {
    const categories = await this.getCategories();
    return categories.find((category) => category.code === categoryId);
  },

  async getProducts(categoryId?: string): Promise<ProductDTO[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: PRODUCTS_SHEET_NAME,
    });

    let data = this.getData({ values: response.data.values || undefined }) || []; // Skip the header row

    if (categoryId)
      data.filter((product) => !categoryId || product[2] === categoryId);

    const products: ProductDTO[] = data
      .map((product) => ({
        id: product[0],
        name: product[1],
        categoryId: product[2],
        image: product[4] || DEFAULT_PRODUCT_IMG,
      }));
    return products;
  },


  async getOrderById(orderId: string): Promise<OrderDto | null> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: ORDERS_SHEET_NAME,
    });

    let data = this.getData({ values: response.data.values || undefined }) || []; // Skip the header row

    const orders: OrderDto[] = data.map((order) => ({
      orderNumber: order[0],
      customerNO: order[1],
      folderLink: order[2],
      orderDate: order[3] ? new Date(new Date(order[3]).getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
      status: order[4],
      image: order.length > 5 ? order[5] : undefined,
      notes: order.length > 6 ? order[6] : undefined,
    }));
    return orders.find((order) => order.orderNumber === orderId) || null;
  },
  async getOrders(): Promise<OrderDto[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: ORDERS_SHEET_NAME,
    });

    let data = this.getData({ values: response.data.values || undefined }) || []; // Skip the header row

    const orders: OrderDto[] = data.map((order) => ({
      orderNumber: order[0],
      customerNO: order[1],
      folderLink: order[2],
      orderDate: order[3] ? new Date(new Date(order[3]).getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
      status: order[4],
      notes: order.length > 5 ? order[5] : undefined,
      image: order.length > 6 ? order[6] : undefined,
    }));

    return orders;
  },
  getData(records: { values?: string[][] }): string[][] {
    return records.values?.slice(1).filter((data) => data[0] && data[0] !== '') || [];
  },

  async getMaterials(): Promise<MaterialDTO[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: MATERIALS_SHEET_NAME,
    });
    let data = this.getData({ values: response.data.values || undefined }) || []; // Skip the header row

    const materials: MaterialDTO[] = data.map((material) => ({
      code: material[0],
      name: material[1],
      imageLink: material.length > 2 ? material[2] : undefined,
    }));
    return materials;
  },
};

export class CategoryService {
  async getAllCategories(): Promise<CategoryDTO[]> {
    return await GoogleSheetsApi.getCategories();
  }

  async getCategoryById(categoryId: string): Promise<CategoryDTO | undefined> {
    return await GoogleSheetsApi.getCategoryById(categoryId);
  }

  async createCategory(code: string, name: string, link: string, image: string | null): Promise<CategoryDTO> {
    const newCategory: CategoryDTO = { code, name, link, image };
    await GoogleSheetsApi.saveCategory(newCategory);
    return newCategory;
  }
}

export class ProductService {

  async getAll(categoryId?: string): Promise<ProductDTO[]> {
    return await GoogleSheetsApi.getProducts();
  }



  async getById(productId: string): Promise<ProductDTO | undefined> {
    const products = await this.getAll();
    return products.find((product) => product.id === productId);
  }

}

