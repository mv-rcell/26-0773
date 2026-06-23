// ==========================================
// 1. AUTOMATED WELCOME POPUP MODAL (INSTANT)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Only launch the welcome modal if the user hasn't seen it during this active browser session
    if (!sessionStorage.getItem("gamezone_welcomed")) {
        createWelcomeModal();
    }
    
    // Core event listener hook for the contact validation engine
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactSubmit);
    }
});

function createWelcomeModal() {
    // Determine context-driven personalized subtitle text based on current authentication profile state
    const currentGamer = localStorage.getItem("gamezone_user") || "Guest Player";
    
    // Create element layout structures
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "welcome-modal-overlay";
    
    // Inject structural inline elements alongside isolated localized layouts
    modalOverlay.innerHTML = `
        <div class="welcome-modal-card">
            <div class="welcome-modal-badge">System Status: Online</div>
            <h2>Welcome to Game Zone</h2>
            <p>Greetings, <span class="welcome-highlight">${currentGamer}</span>! The regional servers are loaded, multiplayer matchmaking queues are live, and the global leaderboard is awaiting your transmission.</p>
            <button id="welcome-close-btn" class="welcome-modal-btn">Load Interface</button>
        </div>
    `;

    // Append dynamic element rules to document body
    document.body.appendChild(modalOverlay);

    // Apply clean overlay stylesheet logic
    Object.assign(modalOverlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(13, 14, 18, 0.85)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        opacity: "0",
        transition: "opacity 0.3s ease",
        padding: "20px"
    });

    // Style the inner display card structural metrics
    const modalCard = modalOverlay.querySelector(".welcome-modal-card");
    Object.assign(modalCard.style, {
        backgroundColor: "#151821",
        border: "1px solid #232734",
        borderTop: "5px solid #ff4655",
        borderRadius: "8px",
        padding: "40px 30px",
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
        transform: "scale(0.8)",
        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    });

    // Style helper components
    const badge = modalOverlay.querySelector(".welcome-modal-badge");
    Object.assign(badge.style, {
        display: "inline-block",
        backgroundColor: "rgba(0, 229, 255, 0.1)",
        color: "#00e5ff",
        fontSize: "0.75rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: "4px 12px",
        borderRadius: "20px",
        marginBottom: "15px",
        letterSpacing: "1px"
    });

    const title = modalOverlay.querySelector("h2");
    Object.assign(title.style, {
        color: "#fff",
        textTransform: "uppercase",
        marginBottom: "15px",
        fontSize: "1.8rem"
    });

    const highlight = modalOverlay.querySelector(".welcome-highlight");
    if (highlight) highlight.style.color = "#ff4655";

    const text = modalOverlay.querySelector("p");
    Object.assign(text.style, {
        color: "#b9c4cf",
        marginBottom: "25px",
        fontSize: "1rem",
        lineHeight: "1.6"
    });

    const closeBtn = modalOverlay.querySelector("#welcome-close-btn");
    Object.assign(closeBtn.style, {
        backgroundColor: "#ff4655",
        color: "white",
        border: "none",
        padding: "12px 30px",
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.2s ease"
    });

    // Hover listeners for the generated modal buttons
    closeBtn.addEventListener("mouseenter", () => { closeBtn.style.backgroundColor = "#e03b48"; });
    closeBtn.addEventListener("mouseleave", () => { closeBtn.style.backgroundColor = "#ff4655"; });

    // Trigger immediate snap pop intro sequence execution loop
    setTimeout(() => {
        modalOverlay.style.opacity = "1";
        modalCard.style.transform = "scale(1)";
    }, 1);

    // Click handler deployment to destroy modal window and flag completion session marker
    closeBtn.addEventListener("click", () => {
        modalOverlay.style.opacity = "0";
        modalCard.style.transform = "scale(0.8)";
        setTimeout(() => {
            modalOverlay.remove();
            sessionStorage.setItem("gamezone_welcomed", "true");
        }, 300);
    });
}

// ==========================================
// 2. COMPREHENSIVE CONTACT FORM VALIDATION
// ==========================================
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
    const errEmail = document.getElementById("error-hint-email") || document.getElementById("error-email");
    const errMsg = document.getElementById("error-msg");

    // Tracking flag
    let isFormValid = true;

    // 3. Complete structural baseline resets
    const inputs = [nameInput, ageInput, phoneInput, genderSelect, emailInput, msgInput];
    const errors = [errName, errAge, errPhone, errGender, errEmail, errMsg];
    
    errors.forEach(err => { if (err) err.style.display = "none"; });
    inputs.forEach(input => { if (input) input.style.borderColor = "#232734"; });
    statusDisplay.textContent = "";

    // 4. Run detailed conditional validation passes (Blank check focus)
    
    // Validate Name
    if (nameInput && nameInput.value.trim() === "") {
        if (errName) errName.style.display = "block";
        nameInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Age
    if (ageInput && (ageInput.value.trim() === "" || parseInt(ageInput.value) <= 0)) {
        if (errAge) errAge.style.display = "block";
        ageInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Phone Connection
    if (phoneInput && phoneInput.value.trim() === "") {
        if (errPhone) errPhone.style.display = "block";
        phoneInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Dropdown Selection
    if (genderSelect && genderSelect.value === "") {
        if (errGender) errGender.style.display = "block";
        genderSelect.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Email Address Structure
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && (emailInput.value.trim() === "" || !emailPattern.test(emailInput.value.trim()))) {
        if (errEmail) errEmail.style.display = "block";
        emailInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // Validate Text Message Body Area
    if (msgInput && msgInput.value.trim() === "") {
        if (errMsg) errMsg.style.display = "block";
        msgInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    // 5. Final decision matrix
    if (isFormValid) {
        statusDisplay.style.color = "#00e5ff";
        statusDisplay.textContent = "⚡ Transmission secure. Your data has safely bypassed our grid firewall!";
        document.getElementById("contact-form").reset(); // Safely flushes input fields
    } else {
        statusDisplay.style.color = "#ff4655";
        statusDisplay.textContent = "❌ Submission rejected. Fill in all missing terminal inputs.";
    }
}