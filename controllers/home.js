'use strict';
const GoogleSheetsApi = require("../services/google-sheets");
const NONE = "";
const INVALID_CATEGORY_ID = "מזהה קטגוריה לא תקין";

function getStatusColor(status) {
    switch (status) {
        case "NEW": return "secondary";
        case "IN_PROGRESS": return "primary";
        case "IN_PRODUCTION": return "info";
        case "COMPLETED": return "success";
        default: return "dark";
    }
}

const home = (request, seo, reply) => defaultRes(request, seo, reply, "index");
const customers = (request, seo, reply) =>
    defaultRes(request, seo, reply, "customers");
const materials = (request, seo, reply) =>
    defaultRes(request, seo, reply, "materials");

const orders = async (request, seo, reply) => {
    let error = null;
    let orders = [];
    let searchQuery = request.query.search || "";
    try {
        orders = await GoogleSheetsApi.getOrders();
        orders = orders.slice(1).filter(order => order.length > 0 && order[0] !== NONE)
            .map((order) => {
                return {
                    orderNo: order[0],
                    customerNo: order[1],
                    orderDate: order[3],
                    status: order[4],
                    statusColor: getStatusColor(order[4]),
                    image: order[5] || '/images/product.webp',
                }
            });
        if (searchQuery) {
            const searchFields = ['name', 'customerNo', 'orderNo'];
            orders = orders.filter(order =>
                searchFields.some(field =>
                    order[field] && order[field].toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }
    catch (err) {
        error = err.message;
        console.log(err);
    }
    return reply.view("/src/pages/orders.hbs", {
        orders: orders,
        searchQuery: searchQuery,
        error: error,
        seo: seo,
    });
};

const categories = async (req, seo, res) => {
    let error = null;
    let categories = [];
    try {
        categories = await GoogleSheetsApi.getCategories();
        console.log('categories', categories);
        categories = categories.slice(1).map((category) => {
            return {
                id: category[0],
                name: category[1],
                url: category[3] || '/images/product.webp.',
            }
        });

    } catch (err) {
        error = err.message;
        console.log(err);
    }
    console.log(categories);
    return res.view("/src/pages/products/categories.hbs", {
        categories: categories,
        error: error,
        seo: seo,
    });
};

const products = async (req, seo, res) => {
    let categoryId = req.params.categoryId;
    let searchQuery = req.query.search || "";


    let error = null;
    let products = [];
    let category = null;
    try {
        if (!categoryId)
            throw new Error(INVALID_CATEGORY_ID);
        category = await GoogleSheetsApi.getCategoryById(categoryId);
        if (!category)
            throw new Error(INVALID_CATEGORY_ID);
        console.log('category', category);
        products = await GoogleSheetsApi.getProducts(req.params.categoryId);
        products = products.slice(1).map((product) => {
            return {
                id: product[0],
                name: product[1],
                url: product[4] || '/images/product.webp.',
            }
        });

        if (searchQuery) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        console.log('products', products);
    } catch (err) {
        error = err.message;
        console.log(err);
    }
    return res.view("/src/pages/products/products.hbs", {
        category: {
            id: category[0],
            name: category[1],
            url: category[3] || '/images/product.webp.',
        },
        searchQuery: searchQuery,
        products: products,
        error: error,
        seo: seo,
    });
}

function defaultRes(request, seo, reply, name) {
    // params is an object we'll pass to our handlebars template
    let params = { seo: seo };

    // If someone clicked the option for a random color it'll be passed in the querystring
    if (request.query.randomize) {
        // We need to load our color data file, pick one at random, and add it to the params
        const colors = require("./src/colors.json");
        const allColors = Object.keys(colors);
        let currentColor = allColors[(allColors.length * Math.random()) << 0];

        // Add the color properties to the params object
        params = {
            color: colors[currentColor],
            colorError: null,
            seo: seo,
        };
    }

    // The Handlebars code will be able to access the parameter values and build them into the page
    return reply.view(`/src/pages/${name}.hbs`, params);
}

module.exports = {
    home,
    orders,
    categories,
    products,
    customers,
    materials,
};
