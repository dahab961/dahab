
export const home = (request, seo, reply) => {
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
    return reply.view("/src/pages/index.hbs", params);
}

export const orders = (request, seo, reply) => defaultRes(request, seo, reply, "orders");
export const customers = (request, seo, reply) => defaultRes(request, seo, reply, "customers");
export const products = (request, seo, reply) => defaultRes(request, seo, reply, "products");
export const materials = (request, seo, reply) => defaultRes(request, seo, reply, "materials");

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

