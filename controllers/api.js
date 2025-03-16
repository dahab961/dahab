const GoogleSheetsApi = require("../services/google-sheets");


const products = async (req, res) => {
    console.log("req.query", req.query);
    let categoryId = req.query.categoryId;
    let searchQuery = req.query.search || "";

    let error = null;
    let products = [];
    let category = null;
    let status = 200;

    try {
        if (!categoryId) throw new Error("Invalid category ID");

        category = await GoogleSheetsApi.getCategoryById(categoryId);
        if (!category) throw new Error("Category not found");

        console.log("category", category);

        let rawProducts = await GoogleSheetsApi.getProducts(categoryId);
        products = rawProducts.slice(1).map((product) => ({
            id: product[0],
            name: product[1],
            url: product[4] || "/images/product.webp",
        }));

        // 🔍 Filter products based on search query
        if (searchQuery) {
            products = products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        console.log("products", products);
    } catch (err) {
        error = err.message;
        status = 500;
        console.log(err);
    }

    return res.status(status).json({
        category: {
            id: category[0],
            name: category[1],
            url: category[3] || "/images/product.webp",
        },
        products: products,
        error: error,
    });
};

module.exports = {
    products,
};
