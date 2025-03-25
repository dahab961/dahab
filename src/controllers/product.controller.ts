import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductDTO } from '../dto/product.dto';
import { GoogleSheetsApi, ProductService } from "../services/googleSheetsApi.service";

export class ProductController {
    private productService = new ProductService();

    async getAllProducts(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const products = await this.productService.getAll();
        reply.send(products);
    }

    async getProductsByCategoryId(req: FastifyRequest<{ Params: { categoryId: string } }>, reply: FastifyReply): Promise<void> {
        const products = await this.productService.getAll(req.params.categoryId);
        reply.send(products);
    }

    // async createOne(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    //     try {
    //         const { id, name, url }: ProductDTO = request.body as ProductDTO;
    //         const newProduct = await this.productService.createOne(id, name, url ?? "");
    //         reply.status(201).send(newProduct);
    //     } catch (error) {
    //         reply.status(500).send({ error: "Failed to create category" });
    //     }
    // }

    async getCategoryById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { id } = request.params as { id: string };
            const product = await this.productService.getById(id);

            if (!product) {
                reply.status(404).send({ error: "Category not found" });
                return;
            }

            reply.send(product);
        } catch (error) {
            reply.status(500).send({ error: "Failed to retrieve category" });
        }
    }
}
