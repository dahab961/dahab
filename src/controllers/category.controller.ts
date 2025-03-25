import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryDTO } from '../dto/category.dto';
import { CategoryService } from "../services/googleSheetsApi.service";

export class CategoryController {
    private categoryService = new CategoryService();

    async getAllCategories(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const categories = await this.categoryService.getAllCategories();
        reply.send(categories);
    }

    async createCategory(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { code, name, link, image }: CategoryDTO = request.body as CategoryDTO;
            const newCategory = await this.categoryService.createCategory(code, name, link, image ?? "");
            reply.status(201).send(newCategory);
        } catch (error) {
            reply.status(500).send({ error: "Failed to create category" });
        }
    }

    async getCategoryById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { id } = request.params as { id: string };
            const category = await this.categoryService.getCategoryById(id);

            if (!category) {
                reply.status(404).send({ error: "Category not found" });
                return;
            }

            reply.send(category);
        } catch (error) {
            reply.status(500).send({ error: "Failed to retrieve category" });
        }
    }
}
