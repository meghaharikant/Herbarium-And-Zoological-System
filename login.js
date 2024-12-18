document.addEventListener("DOMContentLoaded", () => {
    const formPopup = document.querySelector(".form-popup");
    const closeBtn = document.getElementById("close-btn");
    const loginLink = document.getElementById("login-link");
    const signupLink = document.getElementById("signup-link");
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const backToLoginLink = document.getElementById("back-to-login-link");
    const termsLink = document.getElementById("terms-link");
    const termsModal = document.getElementById("terms-modal");
    const termsClose = document.getElementById("terms-close");
    
    function switchForm(showForm) {
        formPopup.classList.remove('show-login', 'show-signup', 'show-forgot-password');
        formPopup.classList.add(showForm);
    }

    // Event listeners for form switching
    signupLink.addEventListener('click', e => {
        e.preventDefault();
        switchForm('show-signup');
    });

    loginLink.addEventListener('click', e => {
        e.preventDefault();
        switchForm('show-login');
    });

    forgotPasswordLink.addEventListener('click', e => {
        e.preventDefault();
        switchForm('show-forgot-password');
    });

    backToLoginLink.addEventListener('click', e => {
        e.preventDefault();
        switchForm('show-login');
    });

    // Show login popup initially
    formPopup.classList.add("show-popup", "show-login");

    // Close the popup
    closeBtn.addEventListener("click", () => {
        formPopup.classList.remove("show-popup", "show-login", "show-signup", "show-forgot-password");
    });

    // Terms and Conditions Modal
    termsLink.addEventListener("click", e => {
        e.preventDefault();
        termsModal.style.display = "block";
    });

    termsClose.addEventListener("click", () => {
        termsModal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === termsModal) {
            termsModal.style.display = "none";
        }
    });

    // Password visibility toggle
    const togglePasswordVisibility = (toggleId, inputId) => {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);

        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggle.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    };

    togglePasswordVisibility('toggle-login-password', 'login-password');
    togglePasswordVisibility('toggle-signup-password', 'signup-password');

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /\W/.test(password);
        return password.length >= minLength && hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChar;
    }

    function checkEmailDomain(email) {
        return email.endsWith("hmz.in");
    }

    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!checkEmailDomain(email)) {
            alert("Login is restricted to users with the domain 'hmz.in'.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password is not strong enough.");
            return;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.status === 'success' ? result.message : result.error);
            if (result.status === 'success') {
                window.location.href = "/"; // Redirect after successful login
            }
        } else {
            const error = await response.json();
            alert(error.error);
        }
    });

    signupForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const policy = document.getElementById("policy").checked;

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!checkEmailDomain(email)) {
            alert("Signup is restricted to users with the domain 'hmz.in'.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password is not strong enough.");
            return;
        }

        if (!policy) {
            alert("You must agree to the Terms & Conditions.");
            return;
        }

        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password, policy: policy ? 'on' : 'off' })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.status === 'success' ? result.message : result.error);
            if (result.status === 'success') {
                window.location.href = "/"; // Redirect after successful signup
            }
        } else {
            const error = await response.json();
            alert(error.error);
        }
    });

    forgotPasswordForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = document.getElementById("forgot-password-email").value;

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!checkEmailDomain(email)) {
            alert("Password reset is restricted to users with the domain 'hmz.in'.");
            return;
        }

        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email })
        });

        if (response.ok) {
            alert("Password reset link sent successfully.");
            window.location.href = "/"; // Redirect after successful password reset
        } else {
            const error = await response.json();
            alert(error.error);
        }
    });
});