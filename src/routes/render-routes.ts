import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as controller from "../controllers/home.controller";
import seo from '@fastify/formbody';

// Ensure ProductsQuery is defined or imported
type ProductsQuery = {
    [key: string]: string;
};

export default async function renderRoutes(app: FastifyInstance) {


    app.get("/", (request, reply) => controller.home(request, seo, reply));
    app.get("/products", async (req: FastifyRequest, res: FastifyReply) =>
        await controller.categories(req, seo, res));

    app.get("/orders", (req: FastifyRequest, reply: FastifyReply) =>
        controller.orders(req, seo, reply)
    );

    app.get("/orders/:orderId", async (req: controller.OrderParam, reply: FastifyReply) => await
        controller.order(req, seo, reply)
    );

    app.get("/materials", (req: FastifyRequest, reply: FastifyReply) =>
        controller.materials(req, seo, reply)
    );  

    app.get("/customers", async (req, reply) => await
        controller.customers(req, seo, reply));

    app.get("/products/:categoryId", async (req: FastifyRequest<{ Params: { categoryId: string }; Query: ProductsQuery }>, reply: FastifyReply): Promise<void> =>
        await controller.products(req, seo, reply));
}
