import { AppConfig, StaffRole } from "./config.js";

const API_BASE_URL = AppConfig.API_BASE_URL;
const PATIENT_ENDPOINT = "patients"; 

// Define allowed roles for viewing patient records
const VIEW_PATIENT_RECORD_ROLES = [StaffRole.ADMIN, StaffRole.DOCTOR, StaffRole.NURSING, StaffRole.PHARMACIST, StaffRole.TECHNOLOGIST];

const patientDetailsContainer = document.getElementById("patientDetailsContainer");
const patientLoadingIndicator = document.getElementById("patientLoadingIndicator");
const patientContentDiv = document.getElementById("patientContent");
const patientMessageDiv = document.getElementById("patientMessage");

const customMessageBox = document.getElementById("customMessageBox");
const messageBoxText = document.getElementById("messageBoxText");

// Global variable to store the patient ID for updates
let currentPatientId = null; 

function showCustomMessage(message, type) {
    messageBoxText.textContent = message;
    customMessageBox.className = "custom-message-box " + type; 
    customMessageBox.style.display = "flex"; 
    
    if (type === "success") {
        setTimeout(hideCustomMessage, 3000); 
    }
}

function hideCustomMessage() {
    customMessageBox.style.display = "none";
    messageBoxText.textContent = "";
    customMessageBox.className = "custom-message-box";
}

function showLoading(show) {
    if (show) {
        patientLoadingIndicator.style.display = "block";
        patientContentDiv.style.display = "none";
        patientMessageDiv.style.display = "none";
    } else {
        patientLoadingIndicator.style.display = "none";
    }
}

function showPatientContent() {
    patientContentDiv.style.display = "block";
    patientMessageDiv.style.display = "none";
}

function showPatientMessage(message, type = "info") {
    patientMessageDiv.textContent = message;
    patientMessageDiv.className = `info-placeholder ${type}`;
    patientMessageDiv.style.display = "block";
    patientContentDiv.style.display = "none";
}

function addMetaFieldForUpdate(container, key = "", value = "") {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "meta-field-group";
    fieldGroup.innerHTML = `
        <div class="form-group">
            <label>Key</label>
            <input type="text" class="meta-key-input" value="${key}" placeholder="e.g., allergies" required>
        </div>
        <div class="form-group">
            <label>Value</label>
            <input type="text" class="meta-value-input" value="${value}" placeholder="e.g., Penicillin">
        </div>
        <button type="button" class="remove-meta-field">Remove</button>
    `;
    container.appendChild(fieldGroup);

    fieldGroup.querySelector(".remove-meta-field").addEventListener("click", () => {
        fieldGroup.remove();
    });
}

async function handleUpdatePatient(event) {
    event.preventDefault();
    showLoading(true);
    hideCustomMessage();

    if (!currentPatientId) {
        showLoading(false);
        showCustomMessage("Error: Patient ID not found for update.", "error");
        return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const updatedPatientData = {};

    for (let [key, value] of formData.entries()) {
        // Exclude the submit button's name if it has one
        if (key === "updatePatientSubmit") continue;

        // Handle empty strings as null for optional fields
        if (value === "") {
            updatedPatientData[key] = null;
        } else {
            updatedPatientData[key] = value;
        }
    }

    // Handle meta data separately
    const metaInputs = form.querySelectorAll("#updateMetaFieldsContainer .meta-field-group");
    const metaDataArray = [];
    let hasEmptyMetaKey = false;
    let hasDuplicateMetaKey = false;
    const seenMetaKeys = new Set();

    metaInputs.forEach(group => {
        const keyInput = group.querySelector(".meta-key-input");
        const valueInput = group.querySelector(".meta-value-input");
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();

        if (key === "") {
            hasEmptyMetaKey = true;
        } else if (seenMetaKeys.has(key)) {
            hasDuplicateMetaKey = true;
            keyInput.style.borderColor = "red"; // Highlight duplicate
        } else {
            seenMetaKeys.add(key);
            metaDataArray.push({ key: key, value: value });
        }
    });

    if (hasEmptyMetaKey) {
        showCustomMessage("Error: Please fill in all meta data keys or remove empty fields.", "error");
        showLoading(false);
        return;
    }
    if (hasDuplicateMetaKey) {
        showCustomMessage("Error: Duplicate keys found in Additional Information. Please use unique keys.", "error");
        showLoading(false);
        return;
    }

    updatedPatientData.meta = metaDataArray.length > 0 ? metaDataArray : []; // Send empty array if no meta data

    const authToken = sessionStorage.getItem("authToken");
    console.log("here")
    console.log(authToken)
    if (!authToken) {
        showLoading(false);
        showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${PATIENT_ENDPOINT}/${currentPatientId}`, {
            method: "PATCH", // Use PATCH for partial updates
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` 
            },
            body: JSON.stringify(updatedPatientData),
        });

        showLoading(false);

        if (response.ok) {
            const result = await response.json();
            showCustomMessage("Patient details updated successfully!", "success");
            // Optionally re-fetch details to ensure UI is in sync with backend
            // fetchPatientDetails(); 
        } else if (response.status === 401) {
            showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        } else if (response.status === 403) {
            showCustomMessage("Error: Insufficient Permissions to update patient records.", "error");
        } else if (response.status === 404) {
            showCustomMessage(`Error: Patient with ID "${currentPatientId}" not found.`, "error");
        } else {
            const errorData = await response.json();
            showCustomMessage("Failed to update patient: " + (errorData.error.detail || "Unknown error"), "error");
        }
    } catch (error) {
        showLoading(false);
        showCustomMessage("Network error during patient update. Please check your network.", "error");
    }
}


async function fetchPatientDetails() {
    showLoading(true);
    hideCustomMessage();
    patientContentDiv.innerHTML = ''; // Clear previous content

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");
    currentPatientId = patientId; // Store for update function

    if (!patientId) {
        showLoading(false);
        showPatientMessage("Error: No patient ID provided in the URL.", "error");
        showCustomMessage("Error: No patient ID provided. Please return to the dashboard.", "error");
        return;
    }

    const authToken = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("authRole");

    if (!authToken) {
        showLoading(false);
        showPatientMessage("Authentication Required: Please log in again.", "error");
        showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
        return;
    }

    if (!userRole || !VIEW_PATIENT_RECORD_ROLES.includes(userRole)) {
        showLoading(false);
        showPatientMessage("Unauthorized: You do not have permission to view patient records.", "error");
        showCustomMessage("Error: Insufficient Permissions to view patient records.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${PATIENT_ENDPOINT}/${patientId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` 
            },
        });

        showLoading(false);

        if (response.ok) {
            const payload = await response.json();
            const patient = payload.data;

            let detailsFormHtml = `<h2>Patient Details: ${patient.first_name || ""} ${patient.surname || ""}</h2>`;
            detailsFormHtml += `<form id="updatePatientForm">`;
            detailsFormHtml += `<div class="detail-grid">`;

            // Helper to create form group HTML
            const createFormGroup = (label, name, value, type = "text", readonly = false, options = null) => {
                let inputHtml = "";
                if (type === "select" && options) {
                    inputHtml = `<select id="patient-${name}" name="${name}">`;
                    inputHtml += `<option value="">Select ${label}</option>`;
                    options.forEach(option => {
                        inputHtml += `<option value="${option}" ${value === option ? "selected" : ""}>${option}</option>`;
                    });
                    inputHtml += `</select>`;
                } else if (type === "textarea") {
                    inputHtml = `<textarea id="patient-${name}" name="${name}" ${readonly ? "readonly" : ""}>${value || ""}</textarea>`;
                } else {
                    inputHtml = `<input type="${type}" id="patient-${name}" name="${name}" value="${value || ""}" ${readonly ? "readonly" : ""}>`;
                }
                return `
                    <div class="form-group">
                        <label for="patient-${name}">${label}</label>
                        ${inputHtml}
                    </div>
                `;
            };

            // Basic Patient Information - Render as editable inputs
            detailsFormHtml += createFormGroup("Registration Code", "registration_code", patient.registration_code, "text", true); // Readonly
            detailsFormHtml += createFormGroup("Title", "title", patient.title || "");
            detailsFormHtml += createFormGroup("Surname", "surname", patient.surname || "");
            detailsFormHtml += createFormGroup("First Name", "first_name", patient.first_name || "");
            detailsFormHtml += createFormGroup("Last Name", "last_name", patient.last_name || "");
            detailsFormHtml += createFormGroup("Date of Birth", "dob", patient.dob || "", "date");
            detailsFormHtml += createFormGroup("Gender", "gender", patient.gender || "", "select", false, ["Male", "Female", "Other"]);
            detailsFormHtml += createFormGroup("Email", "email", patient.email || "", "email");
            detailsFormHtml += createFormGroup("Phone Number", "phone_number", patient.phone_number || "", "tel");
            detailsFormHtml += createFormGroup("Genotype", "genotype", patient.genotype || "", "select", false, ["AA", "AS", "SS", "AC", "SC", "CC"]);
            detailsFormHtml += createFormGroup("Blood Group", "blood_group", patient.blood_group || "", "select", false, ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
            detailsFormHtml += createFormGroup("Contact Information", "contact_information", patient.contact_information || "", "textarea");
            detailsFormHtml += createFormGroup("Emergency Contact", "emergency_contact", patient.emergency_contact || "", "textarea");
            
            detailsFormHtml += `</div>`; // Close detail-grid

            // Meta Data Section
            if (patient.meta && patient.meta.length > 0) {
                detailsFormHtml += `<div class="meta-data-section">`;
                detailsFormHtml += `<h3>Additional Information</h3>`;
                detailsFormHtml += `<div id="updateMetaFieldsContainer">`;
                patient.meta.forEach(metaItem => {
                    // Call addMetaFieldForUpdate to get its HTML and append
                    // This is a bit tricky as addMetaFieldForUpdate directly appends.
                    // We'll build the HTML string here and then attach listeners after rendering.
                    detailsFormHtml += `
                        <div class="meta-field-group">
                            <div class="form-group">
                                <label>Key</label>
                                <input type="text" class="meta-key-input" value="${metaItem.key || ""}" placeholder="e.g., allergies" required>
                            </div>
                            <div class="form-group">
                                <label>Value</label>
                                <input type="text" class="meta-value-input" value="${metaItem.value || ""}" placeholder="e.g., Penicillin">
                            </div>
                            <button type="button" class="remove-meta-field">Remove</button>
                        </div>
                    `;
                });
                detailsFormHtml += `</div>`; // Close updateMetaFieldsContainer
                detailsFormHtml += `<button type="button" id="addMetaFieldForUpdateBtn" class="add-meta-field-button">Add Additional Field</button>`;
                detailsFormHtml += `</div>`; // Close meta-data-section
            } else {
                // If no meta data, render the container and add button so user can add
                detailsFormHtml += `<div class="meta-data-section">`;
                detailsFormHtml += `<h3>Additional Information</h3>`;
                detailsFormHtml += `<div id="updateMetaFieldsContainer">`;
                detailsFormHtml += `<p class="info-placeholder info">No additional information available. Click "Add Additional Field" to add some.</p>`;
                detailsFormHtml += `</div>`; // Close updateMetaFieldsContainer
                detailsFormHtml += `<button type="button" id="addMetaFieldForUpdateBtn" class="add-meta-field-button">Add Additional Field</button>`;
                detailsFormHtml += `</div>`; // Close meta-data-section
            }


            detailsFormHtml += `<button type="submit" id="updatePatientSubmitBtn" class="button-update-patient">Update Patient</button>`;
            detailsFormHtml += `</form>`; // Close form

            patientContentDiv.innerHTML = detailsFormHtml;
            showPatientContent();
            showCustomMessage("Patient details loaded successfully!", "success");

            // Attach event listeners after content is rendered
            document.getElementById("updatePatientForm").addEventListener("submit", handleUpdatePatient);
            document.getElementById("addMetaFieldForUpdateBtn").addEventListener("click", () => {
                const updateMetaFieldsContainer = document.getElementById("updateMetaFieldsContainer");
                // Remove the "No additional information available" message if present
                const infoMsg = updateMetaFieldsContainer.querySelector(".info-placeholder.info");
                if (infoMsg) {
                    infoMsg.remove();
                }
                addMetaFieldForUpdate(updateMetaFieldsContainer);
            });

            // Attach listeners for dynamically added remove buttons
            document.querySelectorAll(".remove-meta-field").forEach(button => {
                button.addEventListener("click", (event) => {
                    event.target.closest(".meta-field-group").remove();
                });
            });


        } else if (response.status === 401) {
            showPatientMessage("Authentication Required: Please log in again.", "error");
            showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        } else if (response.status === 403) {
            showPatientMessage("Insufficient Permissions: You do not have access to view this patient.", "error");
            showCustomMessage("Error: Insufficient Permissions to view patient records.", "error");
        } else if (response.status === 404) {
            showPatientMessage(`Patient with ID "${patientId}" not found.`, "info");
            showCustomMessage(`Patient with ID "${patientId}" not found.`, "error");
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.error.detail || "An unexpected error occurred.";
            showPatientMessage(`Error loading patient: ${errorMessage}`, "error");
            showCustomMessage(`Error loading patient: ${errorMessage}.`, "error");
        }
    } catch (error) {
        showLoading(false);
        showPatientMessage("Network error: Could not connect to the server. Please try again.", "error");
        showCustomMessage("Network error: Could not connect to the server. Please try again.", "error");
    }
}

document.addEventListener("DOMContentLoaded", fetchPatientDetails);
