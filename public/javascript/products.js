// 'use strict';

// (function () {
//     document.addEventListener('DOMContentLoaded', function () {
//         const status = (response) => {
//             if (response.status === 404) {
//                 console.error("Error 404: Not Found");
//                 return Promise.reject(new Error("404 Not Found"));
//             }
//             if (response.status >= 200 && response.status < 300) {
//                 return Promise.resolve(response);
//             } else {
//                 return response.text().then(errorMessage => {
//                     console.error("Error:", errorMessage);
//                     return Promise.reject(new Error(errorMessage));
//                 });
//             }
//         };
//         const json = (response) => response.json();

//         console.log('DOM is ready');
//         const searchInput = document.querySelector('#search input');
//         const errorAlert = document.querySelector('#error-alert');
//         const productsContainer = document.querySelector('#products-container');
//         const titleElem = document.querySelector('#name');

//         const fetchAndRenderProducts = async (search) => {
//             errorAlert.classList.add('d-none'); // Hide error alert on new input

//             try {
//                 let categoryId = 'VWxYzAbCdEfG6'; // Replace with actual category ID

//                 await fetch(`/api/products?categoryId=${categoryId}&search=${search}`)
//                     .then(status)
//                     .then(json)
//                     .then((data) => {
//                         console.log("data: ", data);

//                         //     if (!data || !data.category || !Array.isArray(data.products)) {
//                         //         throw new Error("Invalid response structure");
//                         //     }

//                         //     let products = data.products;
//                         //     let name = data.category.name;

//                         //     titleElem.textContent = name;

//                         //     let productsHtml = '';

//                         //     if (products.length > 0) {
//                         //         productsHtml += '<div class="row justify-content-center">';
//                         //         products.forEach((product) => {
//                         //             productsHtml += `
//                         //                     <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
//                         //                         <a class="card h-100 shadow-sm text-decoration-none" href="/products/${product.id}">
//                         //                             <img src="${product.url}" class="card-img-top img-fluid" alt="${product.name}">
//                         //                             <div class="card-body text-center">
//                         //                                 <h5 class="card-title">${product.name}</h5>
//                         //                             </div>
//                         //                         </a>
//                         //                     </div>`;
//                         //         });
//                         //         productsHtml += '</div>';
//                         //     } else {
//                         //         productsHtml += '<div class="alert alert-warning mt-4" role="alert">אין מוצרים להצגה</div>';
//                         //     }

//                         //     productsContainer.innerHTML = productsHtml;
//                     });
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 errorAlert.classList.remove('d-none');
//             }
//         };

//         // Fetch products on page load
//         fetchAndRenderProducts('');

//         // Fetch products on input change
//         searchInput.addEventListener('input', (event) => {
//             let search = event.target.value.trim();
//             console.log("test", search);
//             fetchAndRenderProducts(search);
//         });
//     });
// })();
