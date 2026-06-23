// ==========================================
// 1. GLOBAL NAVIGATION & STATE HANDLER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    highlightActiveTab();
    checkUserSession();
});

// Auto-highlights the current navbar selector matching the URL link
function highlightActiveTab() {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-container a");
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (currentPath === linkPath) {
            link.classList.add("active");
        } else if (currentPath === "" && linkPath === "index.html") {
            link.classList.add("active"); // Edge case for root access
        } else {
            link.classList.remove("active");
        }
    });
}

// Simulates checking browser localStorage memory to see if a gamer is logged in
function checkUserSession() {
    const activeGamer = localStorage.getItem("gamezone_user");
    const authNavLink = document.getElementById("nav-auth");

    if (authNavLink) {
        if (activeGamer) {
            authNavLink.textContent = `🎮 ${activeGamer}`;
            authNavLink.style.color = "#00e5ff";
            authNavLink.setAttribute("href", "#");
            authNavLink.addEventListener("click", logOutUser);
        } else {
            authNavLink.textContent = "Sign In";
            authNavLink.style.color = "";
            authNavLink.setAttribute("href", "auth.html");
        }
    }
}

function logOutUser(e) {
    e.preventDefault();
    if (confirm("Disconnect from the server? Leave Lobby?")) {
        localStorage.removeItem("gamezone_user");
        localStorage.removeItem("gamezone_email");
        localStorage.removeItem("gamezone_pass");
        window.location.href = "index.html";
    }
}

// ==========================================
// 2. AUTHENTICATION TAB RE-ROUTING (auth.html)
// ==========================================
function switchTab(mode) {
    const loginBox = document.getElementById("login-form-box");
    const signupBox = document.getElementById("signup-form-box");
    const tabBtns = document.querySelectorAll(".auth-tab-btn");
    const feedback = document.getElementById("auth-feedback");

    if (!loginBox || !signupBox) return;
    feedback.textContent = ""; // Clear errors on view switch

    if (mode === "login") {
        loginBox.classList.add("active");
        signupBox.classList.remove("active");
        tabBtns[0].classList.add("active");
        tabBtns[1].classList.remove("active");
    } else {
        signupBox.classList.add("active");
        loginBox.classList.remove("active");
        tabBtns[1].classList.add("active");
        tabBtns[0].classList.remove("active");
    }
}

// ==========================================
// 3. INTERACTIVE SUBMIT CAPTURING
// ==========================================
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const feedbackEl = document.getElementById("auth-feedback");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const tag = document.getElementById("signup-tag").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const pass = document.getElementById("signup-password").value;

        // Commit to basic local state engine
        localStorage.setItem("gamezone_user", tag);
        localStorage.setItem("gamezone_email", email);
        localStorage.setItem("gamezone_pass", pass);

        feedbackEl.style.color = "#00e5ff";
        feedbackEl.textContent = "Registration Successful! Entering Lobby...";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;

        const storedEmail = localStorage.getItem("gamezone_email");
        const storedPass = localStorage.getItem("gamezone_pass");
        const storedTag = localStorage.getItem("gamezone_user");

        // Simple validation checks fallback mock
        if (storedEmail && email === storedEmail && pass === storedPass) {
            feedbackEl.style.color = "#00e5ff";
            feedbackEl.textContent = `Welcome back, Master ${storedTag}!`;
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        } else if (!storedEmail && email === "test@gamezone.com" && pass === "123456") {
            // Default tester credentials setup if user did not sign up first
            localStorage.setItem("gamezone_user", "AlphaPlayer_One");
            feedbackEl.style.color = "#00e5ff";
            feedbackEl.textContent = "Developer Override Accepted. Syncing...";
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        } else {
            feedbackEl.style.color = "#ff4655";
            feedbackEl.textContent = "Incorrect credentials or transmission corrupt.";
        }
    });
}