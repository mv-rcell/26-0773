// ==========================================
// 5. COMPREHENSIVE CONTACT FORM VALIDATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactSubmit);
    }
});

function handleContactSubmit(event) {
    event.preventDefault(); // Stop form submission redirection

    // 1. Gather all input references
    const nameInput = document.getElementById("contact-name");
    const ageInput = document.getElementById("contact-age");
    const phoneInput = document.getElementById("contact-phone");
    const genderSelect = document.getElementById("contact-gender");
    const emailInput = document.getElementById("contact-email");
    const msgInput = document.getElementById("contact-msg");
    const statusDisplay = document.getElementById("contact-status");

    // 2. Gather all warning text layout targets
    const errName = document.getElementById("error-name");
    const errAge = document.getElementById("error-age");
    const errPhone = document.getElementById("error-phone");
    const errGender = document.getElementById("error-gender");
    const errEmail = document.getElementById("error-email");
    const errMsg = document.getElementById("error-msg");

    // Tracking flag
    let isFormValid = true;

    // 3. Complete structural baseline resets
    const inputs = [nameInput, ageInput, phoneInput, genderSelect, emailInput, msgInput];
    const errors = [errName, errAge, errPhone, errGender, errEmail, errMsg];
    
    errors.forEach(err => err.style.display = "none");
    inputs.forEach(input => input.style.borderColor = "#232734");
    statusDisplay.textContent = "";

    // 4. Run detailed conditional validation passes
    
    // Validate Name (Blank check)
    if (nameInput.value.trim() === "") {
        errName.style.display = "block";
        nameInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Age (Blank check + real number sanity)
    if (ageInput.value.trim() === "" || parseInt(ageInput.value) <= 0) {
        errAge.style.display = "block";
        ageInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Phone Connection (Blank check)
    if (phoneInput.value.trim() === "") {
        errPhone.style.display = "block";
        phoneInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Dropdown Selection (Checks for blank string default placeholder value)
    if (genderSelect.value === "") {
        errGender.style.display = "block";
        genderSelect.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Email Address Structure
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === "" || !emailPattern.test(emailInput.value.trim())) {
        errEmail.style.display = "block";
        emailInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Text Message Body Area
    if (msgInput.value.trim() === "") {
        errMsg.style.display = "block";
        msgInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // 5. final decision matrix
    if (isFormValid) {
        statusDisplay.style.color = "#00e5ff";
        statusDisplay.textContent = "⚡ Transmission secure. Your data has safely bypassed our grid firewall!";
        contactForm.reset(); // Safely flushes input fields
    } else {
        statusDisplay.style.color = "#ff4655";
        statusDisplay.textContent = "❌ Submission rejected. Fill in all missing terminal inputs.";
    }
}