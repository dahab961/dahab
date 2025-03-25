'use strict';
import { status, json, show, hide } from "./funcs.js";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        let products = [];


        const productsContainer = document.getElementById("products-container");
        const searchInput = document.getElementById("searchInput");
        const errorAlert = document.getElementById("error-alert");
        const categoryName = document.getElementById("category-name");
        const categoryId = document.getElementById("category-id").value;
        const loadingSpinner = document.getElementById("loading-spinner");

        const refreshButton = document.getElementById("refresh-products");

        refreshButton.addEventListener("click", async () => await fetchProducts());

        async function fetchProducts() {
            try {
                show(loadingSpinner);
                hide(errorAlert);
                hide(productsContainer);

                await fetch(`/api/products/${categoryId}`, {
                    headers: { "Content-Type": "application/json" }
                }).then(status).then(json).then(data => {
                    products = data.products;

                    if (searchInput.value)
                        products = products.filter(product =>
                            product.name.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    displayProducts(products);
                    categoryName.textContent = data.category.name;
                })
            } catch (error) {

                console.error("Error fetching products:", error);
                show(errorAlert);
            } finally {
                hide(loadingSpinner);
                show(productsContainer);
                searchInput.focus();
            }
        }

        function displayProducts(products) {
            if (!products.length) {
                productsContainer.innerHTML = `<div class="alert alert-warning mt-4">אין מוצרים להצגה</div>`;
                return;
            }

            let html = `<p class="text-muted mb-4 shadow-sm">נמצאו ${products.length} הזמנות</p><div class="row" id="products">`;
            products.forEach(product => {
                html += `
            <div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
                <a class="card animated-card2 h-100 shadow-sm text-decoration-none" href="/products/${product.id}">
                    <img src="${product.image}" class="card-img-top img-fluid" alt="${product.name}">
                    <h5 class="">${product.name}</h5>
                    <div class="card-body text-center">
                        </div>
                        <div class=" text-dark bg-transparent border-top-0">
                          קוד:  ${product.id} <br>
                        </div>
                </a>
            </div>`;
            });

            html += `</div>`;
            productsContainer.innerHTML = html;
        }

        searchInput.addEventListener("input", (event) => {
            event.preventDefault();
            const searchQuery = searchInput.value.trim();
            errorAlert.classList.add("d-none");
            const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
            displayProducts(filteredProducts);
        });

        fetchProducts();
    });
})();