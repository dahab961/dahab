'use strict';

import { show, hide, status, json, isHiddenElement } from './funcs.js';
import { STATUSES } from './constants.js';

(() => {
    const uploadImg = () => document.getElementById("image-upload").click();
    document.addEventListener('DOMContentLoaded', () => {
        console.log('loaded');
        const orderIdElem = document.getElementById("order-number");
        const orderId = orderIdElem.textContent;
        let availableProducts = [];

        const addProductBtn = document.getElementById('add-product');
        const editStatusBtn = document.getElementById("edit-status-btn");
        const statusDropdownContainer = document.getElementById("status-dropdown-container");
        const statusDropdown = document.getElementById("status-dropdown");
        const orderStatusElem = document.getElementById('order-status');
        const saveStatusBtn = document.getElementById("save-status-btn");
        const cancelStatusBtn = document.getElementById("cancel-status-btn");
        const orderElem = document.getElementById("order");
        const loadingElem = document.getElementById("loading");
        const imageUploader = document.getElementById("image-upload");
        const uploadBtn = document.getElementById("upload-btn");
        let originalStatus = '';
        imageUploader.addEventListener("change", (event) => displayImagesLocally(event));
        uploadBtn.addEventListener("click", uploadImg);
        function displayImagesLocally(event) {
            const files = event.target.files;
            const orderImgContainer = document.getElementById("order-img");

            orderImgContainer.innerHTML = '';

            Array.from(files).forEach(file => {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const imgElement = document.createElement("img");
                    imgElement.src = e.target.result;
                    imgElement.classList.add("img-thumbnail", "mt-2");
                    imgElement.style.maxWidth = "200px";
                    imgElement.style.marginRight = "10px";
                    orderImgContainer.appendChild(imgElement);
                }
                reader.readAsDataURL(file);
            });
        }

        if (!orderId) {
            orderIdElem.innerHTML = "<p>מספר הזמנה לא תקין</p>";
            return;
        }

        let order = null;

        const fetchOrder = async () => {
            show(loadingElem)
            try {
                await fetch(`/api/orders/${orderId}`).then(res => {
                    if (!response.ok) throw new Error("Error fetching order");
                }).then(async (data) => {
                    const data = await response.json();
                    order = data.order;
                    originalStatus = order.status;
                    orderStatusElem.textContent = order.status;

                    populateStatusDropdown();
                    orderElem.querySelector("#customer-number").textContent = order.customerNO;
                    orderElem.querySelector("#notes").textContent = order.notes;
                });
            } catch (error) {
                console.error("Error fetching order:", error);
                orderContainer.innerHTML = "<p style='color: red;'>אופס משהו השתבש נא לנסות, מאוחר יותר</p>";
            }
            hide(loadingElem)
        }

        const populateStatusDropdown = () => STATUSES.forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            if (status === order.status) {
                option.selected = true;
            }
            statusDropdown.appendChild(option);
        });

        editStatusBtn.addEventListener("click", () =>
            isHiddenElement(statusDropdownContainer) ?
                showStatusDropdown() : hideStatusDropdown()
        );

        function showStatusDropdown() {
            statusDropdown.value = order.status;
            statusDropdownContainer.classList.remove("d-none");
            orderStatusElem.classList.add("d-none");
            editStatusBtn.classList.add("d-none");
        }

        function hideStatusDropdown() {
            statusDropdownContainer.classList.add("d-none");
            orderStatusElem.classList.remove("d-none");
            orderStatusElem.textContent = order.status;
            editStatusBtn.classList.remove("d-none");
        }

        saveStatusBtn.addEventListener("click", async () => {
            const newStatus = statusDropdown.value;
            if (newStatus !== originalStatus) {
                order.status = newStatus;
                orderStatusElem.textContent = newStatus;
            }
            hideStatusDropdown();
        });
        addProductBtn.addEventListener("click", () => addProduct(order.orderNumber));
        cancelStatusBtn.addEventListener("click", () => hideStatusDropdown());

        fetchOrder();
    });
})();
