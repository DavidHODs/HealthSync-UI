import { AppConfig, StaffRole } from "./config.js";

const API_BASE_URL = AppConfig.API_BASE_URL;
const HEALTH_HISTORY_ENDPOINT = "patients/{id}/health-history"

const healthHistoryContainer = document.getElementById("healthHistoryContainer");
const healthHistoryLoadingIndicator = document.getElementById("healthHistoryLoadingIndicator");
const healthHistoryContentDiv = document.getElementById("healthHistoryContent");
const healthHistoryMessageDiv = document.getElementById("healthHistoryMessage");

const customMessageBox = document.getElementById("customMessageBox");
const messageBoxText = document.getElementById("messageBoxText");

const VIEW_HEALTH_HISTORY_ROLES = [StaffRole.ADMIN, StaffRole.DOCTOR, StaffRole.NURSING, StaffRole.PHARMACIST, StaffRole.TECHNOLOGIST];


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
        healthHistoryLoadingIndicator.style.display = "block";
        healthHistoryContentDiv.style.display = "none";
        healthHistoryMessageDiv.style.display = "none";
    } else {
        healthHistoryLoadingIndicator.style.display = "none";
    }
}

function showContent() {
    healthHistoryContentDiv.style.display = "block";
    healthHistoryMessageDiv.style.display = "none";
}

function showMessage(message, type = "info") {
    healthHistoryMessageDiv.textContent = message;
    healthHistoryMessageDiv.className = `no-data-message ${type}`;
    healthHistoryMessageDiv.style.display = "block";
    healthHistoryContentDiv.style.display = "none";
}

// Dummy Data based on HealthHistorySummarySchema
const dummyHealthHistoryData = {
    "data": {
        "patient": {
            "dob": "1970-06-12",
            "gender": "Male",
            "genotype": "AA",
            "blood_group": "O+",
            "meta": [
              {"allergy": "Penicillin, Peanuts"},
              {"chronic_condition": "Diabetes, Hypertension, Migraine, Childhood Asthma"},
              {"current_medication": "Metformin, Lisinopril, Ibuprofen (as needed)"},
              {"past_surgical_history": "Appendectomy (2010)"},
              {"significant_past_medical_events": "Acute Bronchitis (2025), Ankle Sprain (2024), Contact Dermatitis (2022), Influenza A (2016), First-degree Burn (2017)"},
              {"social_history": "Non-smoker, occasional alcohol, works as a teacher"},
              {"family_history": "Father with heart disease, Mother with Type 2 Diabetes"},
              {"last_annual_checkup": "2023-03-10"},
              {"most_recent_diagnosis": "Acute bronchitis (2025-05-17)"},
              {"ongoing_management": "Diabetes, Hypertension, Migraine"},
              {"preventative_care_reminders": "Annual Check-up, Diabetes monitoring (HbA1c), Blood Pressure monitoring"}
            ]
        },
        "encounter_summaries": [
            {
                "date": "2025-05-17T00:00:00",
                "type": "Consultation",
                "doctor": "Dr. David Oluwatobi",
                "complaint": "Fever and cough",
                "diagnosis": "Acute bronchitis",
                "labs": [
                    {"test": "CBC", "result": "Normal"},
                    {"test": "X-Ray", "result": "Clear Lungs"}
                ]
            },
            {
                "date": "2024-11-01T10:30:00",
                "type": "Follow-up",
                "doctor": "Dr. David Peter",
                "complaint": "Persistent headache",
                "diagnosis": "Migraine",
                "labs": []
            },
            {
                "date": "2024-08-20T14:00:00",
                "type": "Emergency Visit",
                "doctor": "Dr. David Ilori",
                "complaint": "Ankle sprain",
                "diagnosis": "Grade 2 sprain",
                "labs": [
                    {"test": "MRI", "result": "Ligament damage observed"}
                ]
            },
            {
                "date": "2023-03-10T09:00:00",
                "type": "Annual Check-up",
                "doctor": "Dr. Joseph Ayo",
                "complaint": "Routine check-up",
                "diagnosis": "Healthy, continue monitoring diabetes",
                "labs": [
                    {"test": "Blood Glucose", "result": "130 mg/dL"},
                    {"test": "Cholesterol Panel", "result": "Normal"}
                ]
            },
            {
                "date": "2022-07-22T11:45:00",
                "type": "Consultation",
                "doctor": "Dr. Ifeoluwa Ayodele",
                "complaint": "Skin rash",
                "diagnosis": "Contact dermatitis",
                "labs": []
            },
            {
                "date": "2021-01-05T16:00:00",
                "type": "Emergency Visit",
                "doctor": "Dr. Kehinde Abiola",
                "complaint": "Severe abdominal pain",
                "diagnosis": "Appendicitis (ruled out)",
                "labs": [
                    {"test": "CT Scan", "result": "No appendicitis"},
                    {"test": "Urinalysis", "result": "Normal"}
                ]
            },
            {
                "date": "2020-09-15T08:30:00",
                "type": "Follow-up",
                "doctor": "Dr. Esan Williams",
                "complaint": "Diabetes management review",
                "diagnosis": "Stable, adjust medication dosage",
                "labs": [
                    {"test": "HbA1c", "result": "7.2%"}
                ]
            },
            {
                "date": "2019-04-01T13:00:00",
                "type": "Consultation",
                "doctor": "Dr. John Arunwe",
                "complaint": "Persistent cough",
                "diagnosis": "Seasonal allergies",
                "labs": []
            },
            {
                "date": "2018-02-28T09:30:00",
                "type": "Annual Check-up",
                "doctor": "Dr. Jumoke Sesan",
                "complaint": "Routine check-up",
                "diagnosis": "Overall good health",
                "labs": [
                    {"test": "Full Blood Count", "result": "Normal"}
                ]
            },
            {
                "date": "2017-06-10T17:00:00",
                "type": "Emergency Visit",
                "doctor": "Dr. Isaac Micheal",
                "complaint": "Minor burn",
                "diagnosis": "First-degree burn, left hand",
                "labs": []
            },
            {
                "date": "2016-11-20T11:00:00",
                "type": "Consultation",
                "doctor": "Dr. Ifeoluwa Ayodele",
                "complaint": "Flu symptoms",
                "diagnosis": "Influenza A",
                "labs": [
                    {"test": "Rapid Flu Test", "result": "Positive"}
                ]
            },
            {
                "date": "2015-08-05T09:00:00",
                "type": "Annual Check-up",
                "doctor": "Dr. Jumoke Williams",
                "complaint": "Routine check-up",
                "diagnosis": "Healthy, no major concerns",
                "labs": []
            }
        ]
    }
};


function renderHealthHistory(data) {
    let html = '';

    // Render Patient Information
    const patient = data.patient;
    if (patient) {
        html += `
            <div class="patient-info-section">
                <h3>Patient Information</h3>
                <div class="info-grid">
                    <div class="info-item"><strong>Date of Birth:</strong> <span>${patient.dob || "N/A"}</span></div>
                    <div class="info-item"><strong>Gender:</strong> <span>${patient.gender || "N/A"}</span></div>
                    <div class="info-item"><strong>Genotype:</strong> <span>${patient.genotype || "N/A"}</span></div>
                    <div class="info-item"><strong>Blood Group:</strong> <span>${patient.blood_group || "N/A"}</span></div>
                </div>
        `;
        if (patient.meta && patient.meta.length > 0) {
            html += `
                <h4 style="text-align: center; margin-top: var(--hs-spacing-lg);">Additional Information</h4>
                <ul class="meta-data-list">
            `;
            patient.meta.forEach(metaItem => {
                // Assuming each metaItem has only one key-value pair
                for (const key in metaItem) {
                    if (Object.hasOwnProperty.call(metaItem, key)) {
                        html += `<li><strong>${key.replace(/_/g, ' ')}:</strong> ${metaItem[key]}</li>`;
                    }
                }
            });
            html += `</ul>`;
        }
        html += `</div>`; // Close patient-info-section
    } else {
        html += `<div class="patient-info-section"><p class="no-data-message">Patient information not available.</p></div>`;
    }

    // Render Encounter Summaries
    const encounters = data.encounter_summaries;
    if (encounters && encounters.length > 0) {
        html += `
            <div class="encounter-section">
                <h3>Encounter History</h3>
                <div class="encounter-cards-container">
        `;
        encounters.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(encounter => { // Sort by date descending
            html += `
                <div class="encounter-card">
                    <h4>${encounter.type || "N/A"} - ${new Date(encounter.date).toLocaleDateString()}</h4>
                    <p><strong>Doctor:</strong> ${encounter.doctor || "N/A"}</p>
                    <p><strong>Complaint:</strong> ${encounter.complaint || "N/A"}</p>
                    <p><strong>Diagnosis:</strong> ${encounter.diagnosis || "N/A"}</p>
            `;
            if (encounter.labs && encounter.labs.length > 0) {
                html += `<p><strong>Lab Results:</strong></p><ul class="labs-list">`;
                encounter.labs.forEach(lab => {
                    html += `<li>${lab.test || "N/A"}: ${lab.result || "N/A"}</li>`;
                });
                html += `</ul>`;
            } else {
                html += `<p><strong>Lab Results:</strong> No labs recorded.</p>`;
            }
            html += `</div>`; // Close encounter-card
        });
        html += `
                </div>
            </div>
        `; // Close encounter-cards-container and encounter-section
    } else {
        html += `<div class="encounter-section"><p class="no-data-message">No encounter history available.</p></div>`;
    }

    healthHistoryContentDiv.innerHTML = html;
    showContent();
}


// Main function to fetch and display health history
async function loadHealthHistory() {
    showLoading(true);
    hideCustomMessage();
    healthHistoryContentDiv.innerHTML = ''; // Clear previous content

    const urlParams = new URLSearchParams(window.location.search);
    // const patientId = urlParams.get("id"); // Get patient ID from URL

    // if (!patientId) {
    //     showLoading(false);
    //     showMessage("Error: No patient ID provided in the URL.", "error");
    //     showCustomMessage("Error: No patient ID provided. Please return to the dashboard.", "error");
    //     return;
    // }

    // const authToken = sessionStorage.getItem("authToken");
    // const userRole = sessionStorage.getItem("authRole");

    // if (!authToken) {
    //     showLoading(false);
    //     showMessage("Authentication Required: Please log in again.", "error");
    //     showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
    //     setTimeout(() => { window.location.href = "index.html"; }, 1500);
    //     return;
    // }

    // if (!userRole || !VIEW_HEALTH_HISTORY_ROLES.includes(userRole)) {
    //     showLoading(false);
    //     showMessage("Unauthorized: You do not have permission to view health history.", "error");
    //     showCustomMessage("Error: Insufficient Permissions to view health history.", "error");
    //     return;
    // }

    // For now, use dummy data. When integrating with a real API, replace this:
    // try {
    //     const response = await fetch(`${API_BASE_URL}/${HEALTH_HISTORY_ENDPOINT}/${patientId}/health-history`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${authToken}` 
    //         },
    //     });

    //     showLoading(false);

    //     if (response.ok) {
    //         const payload = await response.json();
    //         renderHealthHistory(payload.data);
    //         showCustomMessage("Health history loaded successfully!", "success");
    //     } else if (response.status === 401) {
    //         showMessage("Authentication Required: Please log in again.", "error");
    //         showCustomMessage("Authentication Required: Please log in again. Redirecting to login.", "error");
    //         setTimeout(() => { window.location.href = "index.html"; }, 1500);
    //     } else if (response.status === 403) {
    //         showMessage("Insufficient Permissions: You do not have access to view this patient's health history.", "error");
    //         showCustomMessage("Error: Insufficient Permissions to view health history.", "error");
    //     } else if (response.status === 404) {
    //         showMessage(`Health history for patient ID "${patientId}" not found.`, "info");
    //         showCustomMessage(`Health history for patient ID "${patientId}" not found.`, "error");
    //     } else {
    //         const errorData = await response.json();
    //         const errorMessage = errorData.error.detail || "An unexpected error occurred.";
    //         showMessage(`Error loading health history: ${errorMessage}`, "error");
    //         showCustomMessage(`Error loading health history: ${errorMessage}.`, "error");
    //     }
    // } catch (error) {
    //     showLoading(false);
    //     showMessage("Network error: Could not connect to the server. Please try again.", "error");
    //     showCustomMessage("Network error: Could not connect to the server. Please try again.", "error");
    // }

    // Using dummy data for static page
    showLoading(false);
    renderHealthHistory(dummyHealthHistoryData.data);
    showCustomMessage("Dummy health history loaded successfully!", "success");
}

document.addEventListener("DOMContentLoaded", loadHealthHistory);
