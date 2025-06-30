import { AppConfig } from "./config.js";

const LOGIN_ENDPOINT = "auth/login"

const showLoginModalBtn = document.getElementById("showLoginModal");
const loginModalOverlay = document.getElementById("loginModalOverlay");
const closeLoginModalBtn = document.getElementById("closeLoginModal");
const loginForm = document.getElementById("loginForm");

const customMessageBox = document.getElementById("customMessageBox"); 
const messageBoxText = document.getElementById("messageBoxText"); 

function showMessage(message, type) {
    messageBoxText.textContent = message;
    customMessageBox.className = "custom-message-box " + type; 
    customMessageBox.style.display = "flex"; 
}

function hideMessage() {
    messageBoxText.textContent = "";
    customMessageBox.className = "custom-message-box"; 
    customMessageBox.style.display = "none"; 
}

function showModal() {
    hideMessage(); 
    loginModalOverlay.classList.add("show");
    document.body.classList.add("no-scroll"); 
}

function hideModal() {
    loginModalOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll"); 
}


showLoginModalBtn.addEventListener("click", showModal);
closeLoginModalBtn.addEventListener("click", hideModal);

loginModalOverlay.addEventListener("click", (event) => {
    if (event.target === loginModalOverlay) {
        hideModal();
    }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  
  const email = document.getElementById("modal-email").value;
  const password = document.getElementById("modal-password").value;

  hideMessage(); 
  
  try {
      const response = await fetch(`${AppConfig.API_BASE_URL}${LOGIN_ENDPOINT}`, { 
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
          const data = await response.json();

          if (data.data && data.data.auth_token) {
              sessionStorage.setItem("authToken", data.data.auth_token);
              showMessage("Login successful!");

              setTimeout(() => {
                  window.location.href = "../pages/dashboard.html";
              }, 1000);
          }
      } else {
          const errorData = await response.json();

          showMessage(errorData.message || "Authentication failed. Please check your credentials.", "error"); 
      }
  } catch (error) {
      showMessage("An unexpected error occurred. Please check your network connection.", "error"); 
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && loginModalOverlay.classList.contains("show")) {
    hideModal();
  }
});