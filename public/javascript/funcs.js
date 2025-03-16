const status = (response) => {
    if (response.status === 404) return Promise.reject(new Error("404 Not Found"));
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return response.text().then(errorMessage =>
            Promise.reject(new Error(errorMessage))
        );
    }
};
const json = (response) => response.json();

const getMsgWarning = (msg, title, isDoc = false) => {
    const toast = createNode("div", "toast", "text-white", "bg-dark", "border-info", "show");
    const innerContainer = createNode("div", "d-flex", 'fas', 'fa-lg', 'p-2', 'shadow');
    const toastHeader = createNode("div", "toast-header", "bg-dark", "text-white", "border-info");
    toastHeader.innerHTML = `<i class="fas fa-exclamation-triangle text-danger"><strong class="me-auto">${title}</strong></i>`;
    const toastBody = document.createElement("div", "toast-body", "text-danger", "text-right");
    toastBody.textContent = `${msg}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const closeBtn = createNode("button", "btn-close", "btn-close-white", "me-2", "m-auto");
    closeBtn.setAttribute("data-bs-dismiss", "toast");
    closeBtn.setAttribute("aria-label", "Close");

    appendChildrens(innerContainer, toastBody);
    appendChildrens(toast, toastHeader, innerContainer);
    toastHeader.appendChild(closeBtn);
    // add toast to the body at end of page or to the container
    isDoc ? document.body.appendChild(toast) : toastsContainer.appendChild(toast);
    //remove Toast from DOM when clicked
    closeBtn.addEventListener("click", () => {
        toast.remove();
    });
}


function serverErrorHandler(error, deleteRequest = false) {
    let errorMessage;
    console.log(error.status)
    if ((!error.header && !deleteRequest) || error.status === 401) {
        console.log(error.status)

        window.location.href = "/";
        getMsgWarning(errorMessage, "CONNECTION_FAILED", true);
        return;
    } else if (error.json) {
        if (error.msg || error.message) {
            errorMessage = error.msg || error.message || "SERVER_ERROR";
        } else {
            errorMessage = "SERVER_ERROR";
        }

        error
            .json()
            .then((json) => {
                errorMessage = json.message || json.error.msg || "SERVER_ERROR";
            })
            .catch((err) => {
                errorMessage = err.message || "SERVER_ERROR";
            });
    }
    getMsgWarning(errorMessage, "Error");
}

export { status, json, serverErrorHandler };
