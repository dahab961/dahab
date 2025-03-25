import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as apiController from "../controllers/api.controller";
import seo from '@fastify/formbody';
import { OrderParam } from "../controllers/home.controller";

export default async function apiRoutes(app: FastifyInstance) {
    app.get("/api/products/:categoryId", async (req: FastifyRequest<{ Params: { categoryId: string } }>, reply: FastifyReply) => {
        return await apiController.products(req, seo, reply);
    });

    app.get("/api/orders", async (req: FastifyRequest, reply: FastifyReply) => {
        return await apiController.orders(req, seo, reply);
    });

    app.get("/api/orders/:orderId", async (
        req: FastifyRequest<apiController.OrderIdParam>,
        reply: FastifyReply
    ) => await apiController.getOrderById(req, reply));

    app.get("/api/materials", async (req, reply) =>
        await apiController.materials(req, seo, reply)
    );

    app.get("/api/customers", async (req, reply) =>
        await apiController.customers(req, seo, reply)
    );
}
