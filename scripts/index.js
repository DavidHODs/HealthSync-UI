import { AppConfig } from "./config.js";

const API_BASE_URL = AppConfig.API_BASE_URL; 
const GET_ACCESS_TOKEN_ENDPOINT = "auth/get-access-token";
const LOGIN_ENDPOINT = "auth/login";

const showLoginModalBtn = document.getElementById("showLoginModal");
const loginModalOverlay = document.getElementById("loginModalOverlay");
const closeLoginModalBtn = document.getElementById("closeLoginModal");
const loginForm = document.getElementById("loginForm");
const loginSpinner = document.getElementById("loginSpinner");

const accessCodeModalOverlay = document.getElementById("accessCodeModalOverlay");
const closeAccessCodeModalBtn = document.getElementById("closeAccessCodeModal");
const accessCodeForm = document.getElementById("accessCodeForm");
const hiddenTokenInput = document.getElementById("hidden-token");
const accessCodeMessageBox = document.getElementById("accessCodeMessageBox");
const accessCodeMessageBoxText = document.getElementById("accessCodeMessageBoxText");
const accessCodeSpinner = document.getElementById("accessCodeSpinner");

const customMessageBox = document.getElementById("customMessageBox"); 
const messageBoxText = document.getElementById("messageBoxText"); 

function showMessage(message, type, targetMessageBox = customMessageBox, targetMessageBoxText = messageBoxText) {
    targetMessageBoxText.textContent = message;
    targetMessageBox.className = "custom-message-box " + type;
    targetMessageBox.style.display = "flex";
}

function hideMessage(targetMessageBox = customMessageBox, targetMessageBoxText = messageBoxText) {
    targetMessageBoxText.textContent = "";
    targetMessageBox.className = "custom-message-box";
    targetMessageBox.style.display = "none";
}

function showSpinner(spinnerElement) {
    spinnerElement.style.display = "block";
}

function hideSpinner(spinnerElement) {
    spinnerElement.style.display = "none";
}

function showModal(modalOverlay) {
    hideMessage();
    hideMessage(accessCodeMessageBox, accessCodeMessageBoxText);
    modalOverlay.classList.add("show");
    document.body.classList.add("no-scroll");
}

function hideModal(modalOverlay) {
    modalOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
    hideMessage();
    hideMessage(accessCodeMessageBox, accessCodeMessageBoxText);
    hideSpinner(loginSpinner);
    hideSpinner(accessCodeSpinner);
}

showLoginModalBtn.addEventListener("click", () => showModal(loginModalOverlay));
closeLoginModalBtn.addEventListener("click", () => hideModal(loginModalOverlay));
loginModalOverlay.addEventListener("click", (event) => {
    if (event.target === loginModalOverlay) {
        hideModal(loginModalOverlay);
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && loginModalOverlay.classList.contains("show")) {
        hideModal(loginModalOverlay);
    }
});

closeAccessCodeModalBtn.addEventListener("click", () => hideModal(accessCodeModalOverlay));
accessCodeModalOverlay.addEventListener("click", (event) => {
    if (event.target === accessCodeModalOverlay) {
        hideModal(accessCodeModalOverlay);
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && accessCodeModalOverlay.classList.contains("show")) {
        hideModal(accessCodeModalOverlay);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage();
    showSpinner(loginSpinner);

    const getAccessCodeBtn = document.getElementById("getAccessCodeBtn");
    getAccessCodeBtn.disabled = true;

    const email = document.getElementById("modal-email").value;
    const password = document.getElementById("modal-password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/${GET_ACCESS_TOKEN_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        hideSpinner(loginSpinner);
        getAccessCodeBtn.disabled = false;

        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.token) {
                hiddenTokenInput.value = data.data.token;
                hideModal(loginModalOverlay);
                showModal(accessCodeModalOverlay);
                showMessage("Check your email for your access code.", "info", accessCodeMessageBox, accessCodeMessageBoxText);
            } else {
                showMessage("Failed to get access token: No token received.", "error");
            }
        } else {
            const errorData = await response.json();
            showMessage(errorData.error.detail || "Failed to get access code. Please check your credentials.", "error");
        }
    } catch (error) {
        hideSpinner(loginSpinner);
        getAccessCodeBtn.disabled = false;
        showMessage("Network error during access token request. Please check your network connection.", "error");
    }
});

accessCodeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(accessCodeMessageBox, accessCodeMessageBoxText);
    showSpinner(accessCodeSpinner);

    const token = hiddenTokenInput.value;
    const code = document.getElementById("access-code").value;

    if (!token || !code) {
        hideSpinner(accessCodeSpinner);
        showMessage("Missing token or access code. Please try logging in again.", "error", accessCodeMessageBox, accessCodeMessageBoxText);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${LOGIN_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, code }),
        });

        hideSpinner(accessCodeSpinner);

        if (response.ok) {
            const payload = await response.json();
            if (payload.data && payload.data.auth_token && payload.data.staff.role) {
                sessionStorage.setItem("authToken", payload.data.auth_token);
                sessionStorage.setItem("authRole", payload.data.staff.role)
                showMessage("Login successful! Redirecting...", "success", accessCodeMessageBox, accessCodeMessageBoxText);
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                showMessage("Login successful, but no auth token received.", "error", accessCodeMessageBox, accessCodeMessageBoxText);
            }
        } else {
            const errorData = await response.json();
            showMessage(errorData.error.detail || "Authentication failed. Please check your access code.", "error", accessCodeMessageBox, accessCodeMessageBoxText);
        }
    } catch (error) {
        hideSpinner(accessCodeSpinner);
        showMessage("Something went wrong. Please try again", "error", accessCodeMessageBox, accessCodeMessageBoxText);
    }
});
