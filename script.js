// ==========================================
// 0. SUPABASE CLIENT INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://gijwvocyiinrcoxfhuvt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpand2b2N5aWlucmNveGZodXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NzAwMzUsImV4cCI6MjA5ODM0NjAzNX0.6PWcdW7vP6OsVuLQ7sYiWZrWe6PCIk2zW0M-bHuydhI';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. DOM INITIALIZATION & EVENT HOOKS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Sync active session on load
    checkAuthState();

    // Welcome popup launch trigger
    if (!sessionStorage.getItem("gamezone_welcomed")) {
        createWelcomeModal();
    }
    
    // Form Event Listeners
    const contactForm = document.getElementById("contact-form");
    if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);

    const signupForm = document.getElementById("signup-form");
    if (signupForm) signupForm.addEventListener("submit", handleSignupSubmit);
});

// Sync authentication state across pages
async function checkAuthState() {
    const { data: { session } } = await _supabase.auth.getSession();
    const navAuth = document.getElementById("nav-auth");

    if (session) {
        const gamerTag = session.user.user_metadata?.gamer_tag || session.user.email;
        localStorage.setItem("gamezone_user", gamerTag);
        if (navAuth) {
            navAuth.textContent = `Sign Out (${gamerTag})`;
            navAuth.href = "#";
            navAuth.onclick = handleSignOut;
        }
    } else {
        localStorage.removeItem("gamezone_user");
        if (navAuth) {
            navAuth.textContent = "Sign In";
            navAuth.href = "auth.html";
            navAuth.onclick = null;
        }
    }
}

// ==========================================
// 2. AUTHENTICATION TAB & FORM HANDLERS
// ==========================================
function switchTab(tab) {
    const loginBox = document.getElementById("login-form-box");
    const signupBox = document.getElementById("signup-form-box");
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const feedback = document.getElementById("auth-feedback");

    if (feedback) feedback.textContent = "";

    if (tab === 'login') {
        if (loginBox) loginBox.classList.add("active");
        if (signupBox) signupBox.classList.remove("active");
        if (tabLogin) tabLogin.classList.add("active");
        if (tabSignup) tabSignup.classList.remove("active");
    } else {
        if (signupBox) signupBox.classList.add("active");
        if (loginBox) loginBox.classList.remove("active");
        if (tabSignup) tabSignup.classList.add("active");
        if (tabLogin) tabLogin.classList.remove("active");
    }
}

// Handle Sign Up
async function handleSignupSubmit(event) {
    event.preventDefault();
    const tag = document.getElementById("signup-tag").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const feedback = document.getElementById("auth-feedback");

    feedback.style.color = "#00e5ff";
    feedback.textContent = "Registering profile...";

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { gamer_tag: tag }
        }
    });

    if (error) {
        feedback.style.color = "#ff4655";
        feedback.textContent = `❌ ${error.message}`;
    } else {
        feedback.style.color = "#00e5ff";
        feedback.textContent = "⚡ Registration successful! Please check your email for confirmation.";
        document.getElementById("signup-form").reset();
    }
}

// Handle Log In
async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const feedback = document.getElementById("auth-feedback");

    feedback.style.color = "#00e5ff";
    feedback.textContent = "Authenticating...";

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        feedback.style.color = "#ff4655";
        feedback.textContent = `❌ ${error.message}`;
    } else {
        feedback.style.color = "#00e5ff";
        feedback.textContent = "⚡ Access granted! Entering the arena...";
        await checkAuthState();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }
}

// Handle Sign Out
async function handleSignOut(e) {
    e.preventDefault();
    await _supabase.auth.signOut();
    localStorage.removeItem("gamezone_user");
    window.location.reload();
}

// ==========================================
// 3. AUTOMATED WELCOME POPUP MODAL
// ==========================================
function createWelcomeModal() {
    const currentGamer = localStorage.getItem("gamezone_user") || "Guest Player";
    
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "welcome-modal-overlay";
    
    modalOverlay.innerHTML = `
        <div class="welcome-modal-card">
            <div class="welcome-modal-badge">System Status: Online</div>
            <h2>Welcome to Game Zone</h2>
            <p>Greetings, <span class="welcome-highlight">${currentGamer}</span>! The regional servers are loaded, multiplayer matchmaking queues are live, and the global leaderboard is awaiting your transmission.</p>
            <button id="welcome-close-btn" class="welcome-modal-btn">Load Interface</button>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    Object.assign(modalOverlay.style, {
        position: "fixed", top: "0", left: "0",
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(13, 14, 18, 0.85)",
        backdropFilter: "blur(5px)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: "9999", opacity: "0", transition: "opacity 0.3s ease", padding: "20px"
    });

    const modalCard = modalOverlay.querySelector(".welcome-modal-card");
    Object.assign(modalCard.style, {
        backgroundColor: "#151821", border: "1px solid #232734",
        borderTop: "5px solid #ff4655", borderRadius: "8px",
        padding: "40px 30px", maxWidth: "460px", width: "100%",
        textAlign: "center", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
        transform: "scale(0.8)", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    });

    const badge = modalOverlay.querySelector(".welcome-modal-badge");
    Object.assign(badge.style, {
        display: "inline-block", backgroundColor: "rgba(0, 229, 255, 0.1)",
        color: "#00e5ff", fontSize: "0.75rem", fontWeight: "bold",
        textTransform: "uppercase", padding: "4px 12px", borderRadius: "20px",
        marginBottom: "15px", letterSpacing: "1px"
    });

    const title = modalOverlay.querySelector("h2");
    Object.assign(title.style, { color: "#fff", textTransform: "uppercase", marginBottom: "15px", fontSize: "1.8rem" });

    const highlight = modalOverlay.querySelector(".welcome-highlight");
    if (highlight) highlight.style.color = "#ff4655";

    const text = modalOverlay.querySelector("p");
    Object.assign(text.style, { color: "#b9c4cf", marginBottom: "25px", fontSize: "1rem", lineHeight: "1.6" });

    const closeBtn = modalOverlay.querySelector("#welcome-close-btn");
    Object.assign(closeBtn.style, {
        backgroundColor: "#ff4655", color: "white", border: "none",
        padding: "12px 30px", fontSize: "1rem", fontWeight: "bold",
        textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s ease"
    });

    closeBtn.addEventListener("mouseenter", () => { closeBtn.style.backgroundColor = "#e03b48"; });
    closeBtn.addEventListener("mouseleave", () => { closeBtn.style.backgroundColor = "#ff4655"; });

    setTimeout(() => {
        modalOverlay.style.opacity = "1";
        modalCard.style.transform = "scale(1)";
    }, 1);

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
// 4. COMPREHENSIVE CONTACT FORM VALIDATION
// ==========================================
function handleContactSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const ageInput = document.getElementById("contact-age");
    const phoneInput = document.getElementById("contact-phone");
    const genderSelect = document.getElementById("contact-gender");
    const emailInput = document.getElementById("contact-email");
    const msgInput = document.getElementById("contact-msg");
    const statusDisplay = document.getElementById("contact-status");

    const errName = document.getElementById("error-name");
    const errAge = document.getElementById("error-age");
    const errPhone = document.getElementById("error-phone");
    const errGender = document.getElementById("error-gender");
    const errEmail = document.getElementById("error-hint-email") || document.getElementById("error-email");
    const errMsg = document.getElementById("error-msg");

    let isFormValid = true;

    const inputs = [nameInput, ageInput, phoneInput, genderSelect, emailInput, msgInput];
    const errors = [errName, errAge, errPhone, errGender, errEmail, errMsg];
    
    errors.forEach(err => { if (err) err.style.display = "none"; });
    inputs.forEach(input => { if (input) input.style.borderColor = "#232734"; });
    if (statusDisplay) statusDisplay.textContent = "";

    if (nameInput && nameInput.value.trim() === "") {
        if (errName) errName.style.display = "block";
        nameInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    if (ageInput && (ageInput.value.trim() === "" || parseInt(ageInput.value) <= 0)) {
        if (errAge) errAge.style.display = "block";
        ageInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    if (phoneInput && phoneInput.value.trim() === "") {
        if (errPhone) errPhone.style.display = "block";
        phoneInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    if (genderSelect && genderSelect.value === "") {
        if (errGender) errGender.style.display = "block";
        genderSelect.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && (emailInput.value.trim() === "" || !emailPattern.test(emailInput.value.trim()))) {
        if (errEmail) errEmail.style.display = "block";
        emailInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    if (msgInput && msgInput.value.trim() === "") {
        if (errMsg) errMsg.style.display = "block";
        msgInput.style.borderColor = "#ff4655";
        isFormValid = false;
    }

    if (isFormValid && statusDisplay) {
        statusDisplay.style.color = "#00e5ff";
        statusDisplay.textContent = "⚡ Transmission secure. Your data has safely bypassed our grid firewall!";
        document.getElementById("contact-form").reset();
    } else if (statusDisplay) {
        statusDisplay.style.color = "#ff4655";
        statusDisplay.textContent = "❌ Submission rejected. Fill in all missing terminal inputs.";
    }
}