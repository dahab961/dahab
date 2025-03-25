import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import "@fastify/view";

import apiRoutes from "./src/routes/api-routes";
import renderRoutes from "./src/routes/render-routes";
const path = require("path");
const dotenv = require("dotenv");
const Fastify = require("fastify");
// const controller = require("./controllers/home");
// const apiController = require("./controllers/api");

dotenv.config();

const app = Fastify({ logger: false });

// Setup our static files
app.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// Formbody lets us parse incoming forms
app.register(require("@fastify/formbody"));

// View is a templating manager for fastify
app.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  root: path.join(__dirname, "src/views"),
  layout: "layout.hbs",
  options: {
    partials: {
      header: "/partials/header.hbs",
      footer: "/partials/footer.hbs",
      navbar: "/partials/navbar.hbs",
      backButton: "/partials/back-button.hbs",
    },
  },
});

app.register(renderRoutes);
app.register(apiRoutes);

const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

app.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) =>
  reply.status(404).view("/pages/404.hbs")
);

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  const isDev = process.env.NODE_ENV === "development";

  const errorData = {
    message: error.message,
    error: isDev ? error : {}, // Show full error in development
  };

  return reply.status(error.statusCode || 500).view("/pages/error.hbs", errorData);
});

// Run the server and report out to the logs
app.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err: FastifyError, address: string) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);

// // api routes
// app.get("/api/products/:categoryId", async (req, reply) =>
//   await apiController.products(req, seo, reply)
// );

// app.get("/api/materials", async (req, reply) =>
//   await apiController.materials(req, seo, reply)
// );

// //=======================================================
// app.get("/", (request, reply) => controller.home(request, seo, reply));

// app.get("/orders", (req, reply) =>
//   controller.orders(req, seo, reply)
// );
// app.get("/customers", (req, reply) =>
//   controller.customers(req, seo, reply)
// );
// app.get("/products", async (req, reply) =>
//   await controller.categories(req, seo, reply)
// );

// app.get("/products/:categoryId", async (req, reply) =>
//   await controller.products(req, seo, reply)
// );


// app.get("/materials", (req, reply) =>
//   controller.materials(req, seo, reply)
// );
