const API_BASE_URL = 'http://localhost:9000/api/v1';

const showCreateStaffModalBtn = document.getElementById('showCreateStaffModal');
const createStaffModalOverlay = document.getElementById('createStaffModalOverlay');
const closeCreateStaffModalBtn = document.getElementById('closeCreateStaffModal');
const createStaffForm = document.getElementById('createStaffForm');
const staffDepartmentsContainer = document.getElementById('staff-departments-container');
const addStaffDepartmentButton = document.getElementById('addStaffDepartmentButton');

const showUpdateStaffModalBtn = document.getElementById('showUpdateStaffModal');
const updateStaffModalOverlay = document.getElementById('updateStaffModalOverlay');
const closeUpdateStaffModalBtn = document.getElementById('closeUpdateStaffModal');
const updateStaffForm = document.getElementById('updateStaffForm');
const updateStaffDepartmentsContainer = document.getElementById('update-staff-departments-container');
const addUpdateStaffDepartmentButton = document.getElementById('addUpdateStaffDepartmentButton');

const showDeleteStaffModalBtn = document.getElementById('showDeleteStaffModal');
const deleteStaffModalOverlay = document.getElementById('deleteStaffModalOverlay');
const closeDeleteStaffModalBtn = document.getElementById('closeDeleteStaffModal');
const deleteStaffForm = document.getElementById('deleteStaffForm');

const showCreateDepartmentModalBtn = document.getElementById('showCreateDepartmentModal');
const createDepartmentModalOverlay = document.getElementById('createDepartmentModalOverlay');
const closeCreateDepartmentModalBtn = document.getElementById('closeCreateDepartmentModal');
const createDepartmentForm = document.getElementById('createDepartmentForm');

const showUpdateDepartmentModalBtn = document.getElementById('showUpdateDepartmentModal');
const updateDepartmentModalOverlay = document.getElementById('updateDepartmentModalOverlay');
const closeUpdateDepartmentModalBtn = document.getElementById('closeUpdateDepartmentModal');
const updateDepartmentForm = document.getElementById('updateDepartmentForm');

const showDeleteDepartmentModalBtn = document.getElementById('showDeleteDepartmentModal');
const deleteDepartmentModalOverlay = document.getElementById('deleteDepartmentModalOverlay');
const closeDeleteDepartmentModalBtn = document.getElementById('closeDeleteDepartmentModal');
const deleteDepartmentForm = document.getElementById('deleteDepartmentForm');

const showChangePasswordModalBtn = document.getElementById('showChangePasswordModal');
const changePasswordModalOverlay = document.getElementById('changePasswordModalOverlay');
const closeChangePasswordModalBtn = document.getElementById('closeChangePasswordModal');
const changePasswordForm = document.getElementById('changePasswordForm');

const customMessageBox = document.getElementById('customMessageBox');
const messageBoxText = document.getElementById('messageBoxText');

function showCustomMessage(message, type) {
    messageBoxText.textContent = message;
    customMessageBox.className = 'custom-message-box ' + type;
    customMessageBox.style.display = 'flex';
    if (type === 'success') {
        setTimeout(hideCustomMessage, 3000); 
    }
}

function hideCustomMessage() {
    customMessageBox.style.display = 'none';
    messageBoxText.textContent = '';
    customMessageBox.className = 'custom-message-box';
}

function showModal(modalOverlay, formToReset = null) {
    hideCustomMessage();
    modalOverlay.classList.add('show');
    document.body.classList.add('no-scroll');
    if (formToReset) {
        formToReset.reset();
    }
    if (modalOverlay === createStaffModalOverlay) {
        staffDepartmentsContainer.innerHTML = '';
        addStaffDepartmentField(staffDepartmentsContainer);
    }
    if (modalOverlay === updateStaffModalOverlay) {
        updateStaffDepartmentsContainer.innerHTML = '';
        addStaffDepartmentField(updateStaffDepartmentsContainer);
    }
}

function hideModal(modalOverlay, formToReset = null) {
    modalOverlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
    if (formToReset) {
        formToReset.reset();
    }
    hideCustomMessage();
}

function addStaffDepartmentField(container, name = '') {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'department-field-group';
    fieldGroup.innerHTML = `
        <div class="form-group">
            <label>Department Name</label>
            <input type="text" class="staff-department-name-input" value="${name}" placeholder="e.g., Pharmacy" required>
        </div>
        <button type="button" class="remove-department-field">Remove</button>
    `;
    container.appendChild(fieldGroup);

    fieldGroup.querySelector('.remove-department-field').addEventListener('click', () => {
        fieldGroup.remove();
    });
}

showCreateStaffModalBtn.addEventListener('click', () => showModal(createStaffModalOverlay, createStaffForm));
closeCreateStaffModalBtn.addEventListener('click', () => hideModal(createStaffModalOverlay, createStaffForm));
createStaffModalOverlay.addEventListener('click', (event) => {
    if (event.target === createStaffModalOverlay) {
        hideModal(createStaffModalOverlay, createStaffForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && createStaffModalOverlay.classList.contains('show')) {
        hideModal(createStaffModalOverlay, createStaffForm);
    }
});

addStaffDepartmentButton.addEventListener('click', () => addStaffDepartmentField(staffDepartmentsContainer));

showUpdateStaffModalBtn.addEventListener('click', () => showModal(updateStaffModalOverlay, updateStaffForm));
closeUpdateStaffModalBtn.addEventListener('click', () => hideModal(updateStaffModalOverlay, updateStaffForm));
updateStaffModalOverlay.addEventListener('click', (event) => {
    if (event.target === updateStaffModalOverlay) {
        hideModal(updateStaffModalOverlay, updateStaffForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && updateStaffModalOverlay.classList.contains('show')) {
        hideModal(updateStaffModalOverlay, updateStaffForm);
    }
});

addUpdateStaffDepartmentButton.addEventListener('click', () => addStaffDepartmentField(updateStaffDepartmentsContainer));

showDeleteStaffModalBtn.addEventListener('click', () => showModal(deleteStaffModalOverlay, deleteStaffForm));
closeDeleteStaffModalBtn.addEventListener('click', () => hideModal(deleteStaffModalOverlay, deleteStaffForm));
deleteStaffModalOverlay.addEventListener('click', (event) => {
    if (event.target === deleteStaffModalOverlay) {
        hideModal(deleteStaffModalOverlay, deleteStaffForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && deleteStaffModalOverlay.classList.contains('show')) {
        hideModal(deleteStaffModalOverlay, deleteStaffForm);
    }
});

showCreateDepartmentModalBtn.addEventListener('click', () => showModal(createDepartmentModalOverlay, createDepartmentForm));
closeCreateDepartmentModalBtn.addEventListener('click', () => hideModal(createDepartmentModalOverlay, createDepartmentForm));
createDepartmentModalOverlay.addEventListener('click', (event) => {
    if (event.target === createDepartmentModalOverlay) {
        hideModal(createDepartmentModalOverlay, createDepartmentForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && createDepartmentModalOverlay.classList.contains('show')) {
        hideModal(createDepartmentModalOverlay, createDepartmentForm);
    }
});

showUpdateDepartmentModalBtn.addEventListener('click', () => showModal(updateDepartmentModalOverlay, updateDepartmentForm));
closeUpdateDepartmentModalBtn.addEventListener('click', () => hideModal(updateDepartmentModalOverlay, updateDepartmentForm));
updateDepartmentModalOverlay.addEventListener('click', (event) => {
    if (event.target === updateDepartmentModalOverlay) {
        hideModal(updateDepartmentModalOverlay, updateDepartmentForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && updateDepartmentModalOverlay.classList.contains('show')) {
        hideModal(updateDepartmentModalOverlay, updateDepartmentForm);
    }
});

showDeleteDepartmentModalBtn.addEventListener('click', () => showModal(deleteDepartmentModalOverlay, deleteDepartmentForm));
closeDeleteDepartmentModalBtn.addEventListener('click', () => hideModal(deleteDepartmentModalOverlay, deleteDepartmentForm));
deleteDepartmentModalOverlay.addEventListener('click', (event) => {
    if (event.target === deleteDepartmentModalOverlay) {
        hideModal(deleteDepartmentModalOverlay, deleteDepartmentForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && deleteDepartmentModalOverlay.classList.contains('show')) {
        hideModal(deleteDepartmentModalOverlay, deleteDepartmentForm);
    }
});

showChangePasswordModalBtn.addEventListener('click', () => showModal(changePasswordModalOverlay, changePasswordForm));
closeChangePasswordModalBtn.addEventListener('click', () => hideModal(changePasswordModalOverlay, changePasswordForm));
changePasswordModalOverlay.addEventListener('click', (event) => {
    if (event.target === changePasswordModalOverlay) {
        hideModal(changePasswordModalOverlay, changePasswordForm);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && changePasswordModalOverlay.classList.contains('show')) {
        hideModal(changePasswordModalOverlay, changePasswordForm);
    }
});


createStaffForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const formData = new FormData(createStaffForm);
    const staffData = {};
    for (let [key, value] of formData.entries()) {
        staffData[key] = value;
    }

    const departmentInputs = staffDepartmentsContainer.querySelectorAll('.staff-department-name-input');
    const departmentsArray = [];
    let hasEmptyDepartmentName = false;

    departmentInputs.forEach(input => {
        const deptName = input.value.trim();
        if (deptName) {
            departmentsArray.push({ id: deptName });
        } else {
            hasEmptyDepartmentName = true;
        }
    });

    if (hasEmptyDepartmentName) {
        showCustomMessage('Please fill in all department name fields or remove empty ones.', 'error');
        return;
    }

    staffData.departments = departmentsArray;
    
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(staffData),
        });

        if (response.status === 201) {
            const result = await response.json();
            showCustomMessage(`Staff created successfully! ID: ${result.data.id}.`, 'success');
            hideModal(createStaffModalOverlay, createStaffForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to create staff.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to create staff: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during staff creation. Please check your network.', 'error');
    }
});

updateStaffForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const staffEmail = document.getElementById('update-staff-email-id').value.trim();
    if (!staffEmail) {
        showCustomMessage('Staff Email is required for update.', 'error');
        return;
    }

    const formData = new FormData(updateStaffForm);
    const staffData = {};
    for (let [key, value] of formData.entries()) {
        if (key !== 'staff_email_id') {
            staffData[key] = value;
        }
    }

    const departmentInputs = updateStaffDepartmentsContainer.querySelectorAll('.staff-department-name-input');
    const departmentsArray = [];
    let hasEmptyDepartmentName = false;

    departmentInputs.forEach(input => {
        const deptName = input.value.trim();
        if (deptName) {
            departmentsArray.push({ id: deptName });
        } else {
            hasEmptyDepartmentName = true;
        }
    });

    if (hasEmptyDepartmentName) {
        showCustomMessage('Please fill in all department name fields or remove empty ones.', 'error');
        return;
    }

    staffData.departments = departmentsArray;

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${staffEmail}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(staffData),
        });

        if (response.status === 200) {
            const result = await response.json();
            showCustomMessage(`Staff updated successfully!`, 'success');
            hideModal(updateStaffModalOverlay, updateStaffForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to update staff.', 'error');
        } else if (response.status === 404) {
            showCustomMessage('Error: Staff not found.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to update staff: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during staff update. Please check your network.', 'error');
    }
});

deleteStaffForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const staffEmail = document.getElementById('delete-staff-email').value.trim();
    if (!staffEmail) {
        showCustomMessage('Staff Email is required for deletion.', 'error');
        return;
    }

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${staffEmail}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        });

        if (response.status === 204) {
            showCustomMessage('Staff deleted successfully!', 'success');
            hideModal(deleteStaffModalOverlay, deleteStaffForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to delete staff.', 'error');
        } else if (response.status === 404) {
            showCustomMessage('Error: Staff not found.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to delete staff: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during staff deletion. Please check your network.', 'error');
    }
});

createDepartmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const formData = new FormData(createDepartmentForm);
    const departmentData = {};
    for (let [key, value] of formData.entries()) {
        departmentData[key] = value;
    }

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(departmentData),
        });

        if (response.status === 201) {
            const result = await response.json();
            showCustomMessage(`Department created successfully! ID: ${result.data.id}.`, 'success');
            hideModal(createDepartmentModalOverlay, createDepartmentForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to create department.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to create department: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during department creation. Please check your network.', 'error');
    }
});

updateDepartmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const departmentId = document.getElementById('update-department-id').value.trim();
    if (!departmentId) {
        showCustomMessage('Department ID is required for update.', 'error');
        return;
    }

    const formData = new FormData(updateDepartmentForm);
    const departmentData = {};
    for (let [key, value] of formData.entries()) {
        if (key !== 'department_id') {
            departmentData[key] = value;
        }
    }

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(departmentData),
        });

        if (response.status === 200) {
            const result = await response.json();
            showCustomMessage(`Department updated successfully!`, 'success');
            hideModal(updateDepartmentModalOverlay, updateDepartmentForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to update department.', 'error');
        } else if (response.status === 404) {
            showCustomMessage('Error: Department not found.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to update department: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during department update. Please check your network.', 'error');
    }
});

deleteDepartmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const departmentId = document.getElementById('delete-department-id').value.trim();
    if (!departmentId) {
        showCustomMessage('Department ID is required for deletion.', 'error');
        return;
    }

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        });

        if (response.status === 204) {
            showCustomMessage('Department deleted successfully!', 'success');
            hideModal(deleteDepartmentModalOverlay, deleteDepartmentForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions to delete department.', 'error');
        } else if (response.status === 404) {
            showCustomMessage('Error: Department not found.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to delete department: ' + (error.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Network error during department deletion. Please check your network.', 'error');
    }
});

changePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideCustomMessage();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    // const email = document.getElementById('email').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showCustomMessage('All password fields are required.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showCustomMessage('New password and confirmation do not match.', 'error');
        return;
    }

    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, { // Assuming an endpoint that uses the token for identification
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ email: "davidoluwatobi41@gmail.com", old_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }),
        });

        if (response.status === 200) {
            const result = await response.json();
            showCustomMessage('Password changed successfully!', 'success');
            hideModal(changePasswordModalOverlay, changePasswordForm);
        } else if (response.status === 401) {
            showCustomMessage('Authentication Required: Please log in again. Redirecting to login.', 'error');
            window.location.href = 'index.html';
        } else if (response.status === 403) {
            showCustomMessage('Error: Insufficient Permissions or invalid current password.', 'error');
        } else {
            const error = await response.json();
            showCustomMessage('Failed to change password: ' + (error.error.detail || 'Unknown error'), 'error');
        }
    } catch (error) {
        showCustomMessage('Wrror during password change: , '+(error.error.detail));
    }
});
