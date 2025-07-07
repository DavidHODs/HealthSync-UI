import { AppConfig, StaffRole } from "./config.js";

const API_BASE_URL = AppConfig.API_BASE_URL;
const PATIENT_ENDPOINT = "patients"; 

const ADD_NEW_PATIENT_ROLES = [StaffRole.ADMIN, StaffRole.DOCTOR];
const VIEW_PATIENT_RECORD_ROLES = [StaffRole.ADMIN, StaffRole.DOCTOR, StaffRole.NURSING, StaffRole.PHARMACIST, StaffRole.TECHNOLOGIST];

const searchButton = document.getElementById("searchButton");
const addNewPatientButton = document.getElementById("addNewPatientButton");
const registrationCodeInput = document.getElementById("registration-code");
const searchResultsDiv = document.getElementById("searchResults");
const searchLoadingIndicator = document.getElementById("searchLoadingIndicator");

const newPatientModalOverlay = document.getElementById("newPatientModalOverlay");
const closeNewPatientModalBtn = document.getElementById("closeNewPatientModal");
const newPatientForm = document.getElementById("newPatientForm");
const metaFieldsContainer = document.getElementById("meta-fields-container");
const addMetaFieldButton = document.getElementById("addMetaFieldButton");

const customMessageBox = document.getElementById("customMessageBox");
const messageBoxText = document.getElementById("messageBoxText");

function showCustomMessage(message, type) {
    messageBoxText.textContent = message;
    customMessageBox.className = "custom-message-box " + type; 
    customMessageBox.style.display = "flex"; 
}

function hideCustomMessage() {
    customMessageBox.style.display = "none";
    messageBoxText.textContent = "";
    customMessageBox.className = "custom-message-box";
}

function showLoading(show) {
    if (show) {
        searchResultsDiv.innerHTML = "";
        searchLoadingIndicator.style.display = "block";
        searchResultsDiv.style.minHeight = "200px"; 
    } else {
        searchLoadingIndicator.style.display = "none";
    }
}

function addMetaField(key = "", value = "") {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "meta-field-group";
    fieldGroup.innerHTML = `
        <div class="form-group">
            <label>Key</label>
            <input type="text" class="meta-key-input" value="${key}" placeholder="e.g., allergies">
        </div>
        <div class="form-group">
            <label>Value</label>
            <input type="text" class="meta-value-input" value="${value}" placeholder="e.g., Penicillin">
        </div>
        <button type="button" class="remove-meta-field">Remove</button>
    `;
    metaFieldsContainer.appendChild(fieldGroup);

    fieldGroup.querySelector(".remove-meta-field").addEventListener("click", () => {
        fieldGroup.remove();
    });
}

function showNewPatientModal() {
    const userRole = sessionStorage.getItem("authRole");
    
    if (!userRole || !ADD_NEW_PATIENT_ROLES.includes(userRole)) {
        showCustomMessage("Unauthorized: You do not have permission to add new patients.", "error");
        return;
    }
    
    hideCustomMessage(); 
    newPatientModalOverlay.classList.add("show");
    document.body.classList.add("no-scroll"); 
    metaFieldsContainer.innerHTML = ""; 
    addMetaField(); 
}

function hideNewPatientModal() {
    newPatientModalOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll"); 
    newPatientForm.reset(); 
  
    newPatientForm.querySelector("#new-patient-dob").value = ""; 
    newPatientForm.querySelector("#new-patient-gender").value = ""; 
    newPatientForm.querySelector("#new-patient-genotype").value = ""; 
    newPatientForm.querySelector("#new-patient-blood-group").value = ""; 
    metaFieldsContainer.innerHTML = "";
    hideCustomMessage(); 
}


function checkUserPermissions() {
    const userRole = sessionStorage.getItem("authRole");

    if (!userRole || !ADD_NEW_PATIENT_ROLES.includes(userRole)) {
        addNewPatientButton.disabled = true;
        addNewPatientButton.style.opacity = "0.5"; 
        addNewPatientButton.style.cursor = "not-allowed";
    } else {
        addNewPatientButton.disabled = false;
        addNewPatientButton.style.opacity = "1";
        addNewPatientButton.style.cursor = "pointer";
    }
}

document.addEventListener("DOMContentLoaded", checkUserPermissions);

searchButton.addEventListener("click", async () => {
    const regCode = registrationCodeInput.value.trim();
    hideCustomMessage();
    searchResultsDiv.innerHTML = ""; 
    searchResultsDiv.style.color = "var(--hs-color-neutral-dark-grey)";
    searchResultsDiv.style.fontStyle = "italic";
    searchResultsDiv.style.textAlign = "center";

    if (!regCode) {
        showCustomMessage("Please enter a registration number to search.", "error");
        return;
    }

    showLoading(true);

    const authToken = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("authRole");

    if (!authToken) {
        showLoading(false);
        showCustomMessage("Error: Not authenticated. Redirecting to login.", "error");
        window.location.href = "index.html"; 
        return;
    }

    if (!userRole || !VIEW_PATIENT_RECORD_ROLES.includes(userRole)) {
        showLoading(false);
        showCustomMessage("Unauthorized: You do not have permission to view patient records.", "error");
        return;
    }

    try {
        const fullSearchUrl = `${API_BASE_URL}/${PATIENT_ENDPOINT}/${regCode}/search-by-registration-code`;

        const response = await fetch(fullSearchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` 
            },
        });

        showLoading(false);

        if (response.ok) { 
            const payload = await response.json();

            if (payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
              const isSingle = payload.data.length === 1;
              let patientsHtml = `<h3>${isSingle ? "Patient" : "Patients"} Found:</h3>`;
              payload.data.forEach(patient => {
                patientsHtml += `
                  <div style="text-align: left; padding: var(--hs-spacing-md); border-bottom: 1px solid var(--hs-color-neutral-medium-grey); margin-bottom: var(--hs-spacing-md);">
                    <p><strong>Registration Code:</strong> ${patient.registration_code}</p>
                    <p><strong>Name:</strong> ${patient.first_name || ""} ${patient.last_name || ""} ${patient.surname || ""}</p>
                    <a href="patient.html?id=${patient.id}" class="button-primary" style="margin-top: var(--hs-spacing-md); text-decoration: none;">View Full Record</a>
                  </div>
                `;
              });
              searchResultsDiv.innerHTML = patientsHtml;
              searchResultsDiv.style.color = "var(--hs-color-neutral-text-dark)";
              searchResultsDiv.style.fontStyle = "normal";
              searchResultsDiv.style.textAlign = "left";
              showCustomMessage(`${payload.data.length > 1 ? "Patients" : "Patient"} found successfully!`, "success");

            } else {
                searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-status-info);">No patient found with registration code: <strong>${regCode}</strong>.</p>`;
                searchResultsDiv.style.color = "var(--hs-color-status-info)";
                searchResultsDiv.style.fontStyle = "italic";
                searchResultsDiv.style.textAlign = "center";
                showCustomMessage(`No patient found with registration code: ${regCode}.`, "error"); 
            }

        } else if (response.status === 401) {
            searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-alert-error);">Authentication Required: Please log in again.</p>`;
            searchResultsDiv.style.textAlign = "center";
            showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error"); 
            window.location.href = "index.html"; 

        } else if (response.status === 403) { 
            searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-alert-error);">Insufficient Permissions: You do not have access to view this patient.</p>`;
            searchResultsDiv.style.textAlign = "center";
            showCustomMessage("Error: Insufficient Permissions to view patient records.", "error");

        } else if (response.status === 404) {
            searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-status-info);">Patient with registration code <strong>${regCode}</strong> not found.</p>`;
            searchResultsDiv.style.color = "var(--hs-color-status-info)";
            searchResultsDiv.style.fontStyle = "italic";
            searchResultsDiv.style.textAlign = "center";
            showCustomMessage(`Patient with registration code ${regCode} not found.`, "error"); 

        } else {
            const errorData = await response.json();
            const errorMessage = errorData.error.detail || "An unexpected error occurred.";
            searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-alert-error);">Error searching: ${errorMessage}</p>`;
            searchResultsDiv.style.textAlign = "center";
            showCustomMessage(`Error searching: ${errorMessage}.`, "error");
        }
    } catch (error) {
        showLoading(false); 
        searchResultsDiv.innerHTML = `<p style="color: var(--hs-color-alert-error);">Network error: Could not connect to the server. Please try again.</p>`;
        searchResultsDiv.style.textAlign = "center";
        showCustomMessage("Network error: Could not connect to the server. Please try again.", "error"); 
    }
});

addNewPatientButton.addEventListener("click", showNewPatientModal);

closeNewPatientModalBtn.addEventListener("click", hideNewPatientModal);
newPatientModalOverlay.addEventListener("click", (event) => {
    if (event.target === newPatientModalOverlay) {
        hideNewPatientModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && newPatientModalOverlay.classList.contains("show")) {
        hideNewPatientModal();
    }
});

addMetaFieldButton.addEventListener("click", () => addMetaField());

newPatientForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    hideCustomMessage(); 

    const formData = new FormData(newPatientForm);
    const patientData = {};
    for (let [key, value] of formData.entries()) {
        if (value === "") { 
            patientData[key] = null;
        } else {
            patientData[key] = value;
        }
    }

    patientData.dob = patientData.dob === "" ? null : patientData.dob;
    patientData.genotype = patientData.genotype === "" ? null : patientData.genotype;
    patientData.blood_group = patientData.blood_group === "" ? null : patientData.blood_group;
    patientData.gender = patientData.gender === "" ? null : patientData.gender;

    const metaInputs = metaFieldsContainer.querySelectorAll(".meta-field-group");
    const metaDataArray = []; 
    let hasDuplicateMetaKey = false;

    metaInputs.forEach(group => {
        const keyInput = group.querySelector(".meta-key-input");
        const valueInput = group.querySelector(".meta-value-input");
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();

        if (key !== "") { 
            const isDuplicate = metaDataArray.some(item => item.key === key);
            if (isDuplicate) {
                hasDuplicateMetaKey = true;
                keyInput.style.borderColor = "red"; 
            }
            metaDataArray.push({ key: key, value: value }); 
        }
    });

    if (hasDuplicateMetaKey) {
        showCustomMessage("Error: Duplicate keys found in Additional Information. Please use unique keys.", "error");
        return; 
    }
    
    patientData.meta = metaDataArray.length > 0 ? metaDataArray : []; 
    
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
        showCustomMessage("Error: Not authenticated. Redirecting to login.", "error");
        window.location.href = "index.html"; 
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${PATIENT_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` 
            },
            body: JSON.stringify(patientData),
        });

        if (response.ok) { 
            const result = await response.json();
            showCustomMessage(`Patient registered successfully! Registraton Code: ${result.data.message}`);

        } else if (response.status === 401) {
            const errorData = await response.json();
            showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
            window.location.href = "index.html"; 

        } else if (response.status === 403) { 
            const errorData = await response.json();
            showCustomMessage("Error: Insufficient Permissions to register new patient.", "error");

        } else {
            const errorData = await response.json();
            showCustomMessage("Failed to register patient: " + (errorData.error.detail || "Unknown error"), "error");
        }
    } catch (error) {
        showCustomMessage("An error occurred during registration");
    }
});

registrationCodeInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click(); 
    }
});
