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
}// ==========================================
// 4. AUTOMATED WELCOME POPUP MODAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Only launch the welcome modal if the user hasn't seen it during this active browser session
    if (!sessionStorage.getItem("gamezone_welcomed")) {
        createWelcomeModal();
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
        transition: "opacity 0.4s ease",
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
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
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

    // Trigger subtle fade-and-pop intro sequence via timeouts
    setTimeout(() => {
        modalOverlay.style.opacity = "1";
        modalCard.style.transform = "scale(1)";
    }, 50);

    // Click handler deployment to destroy modal window and flag completion session marker
    closeBtn.addEventListener("click", () => {
        modalOverlay.style.opacity = "0";
        modalCard.style.transform = "scale(0.8)";
        setTimeout(() => {
            modalOverlay.remove();
            // Using sessionStorage means it will pop up once per visit, but won't annoy them on every click
            sessionStorage.setItem("gamezone_welcomed", "true");
        }, 400);
    });
}