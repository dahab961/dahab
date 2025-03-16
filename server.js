/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");
const controller = require("./controllers/home");
const apiController = require("./controllers/api");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  options: {
    partials: {
      header: "/src/partials/header.hbs",
      footer: "/src/partials/footer.hbs",
      navbar: "/src/partials/navbar.hbs",
      backButton: "/src/partials/back-button.hbs",
    },
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

fastify.get("/", (request, reply) => controller.home(request, seo, reply));

fastify.get("/api/products", async (req, reply) =>
  await apiController.products(req, seo, reply)
);

fastify.get("/orders", (req, reply) =>
  controller.orders(req, seo, reply)
);
fastify.get("/customers", (req, reply) =>
  controller.customers(req, seo, reply)
);
fastify.get("/products", async (req, reply) =>
  await controller.categories(req, seo, reply)
);

fastify.get("/products/:categoryId", async (req, reply) =>
  await controller.products(req, seo, reply)
);


fastify.get("/materials", (req, reply) =>
  controller.materials(req, seo, reply)
);

fastify.setNotFoundHandler((req, reply) => {
  reply.status(404).view("/src/pages/404.hbs");
});

fastify.setErrorHandler((error, req, reply) => {
  // Set locals, only providing error in development
  const isDev = process.env.NODE_ENV === "development";

  const errorData = {
    message: error.message,
    error: isDev ? error : {}, // Show full error in development
  };

  reply.status(error.statusCode || 500).view("/src/pages/error.hbs", errorData);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
