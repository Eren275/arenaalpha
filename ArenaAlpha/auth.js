// Authentication state management + show/hide password + signup/signin forms
(async function() {
    let isLoggedIn = false;
    let currentUser = null;

    // DOM elements for auth buttons
    const signInButtons = document.querySelectorAll('a[href="signin.html"], a.sign-btn[href*="signin"]');
    const signUpButtons = document.querySelectorAll('a[href="signup.html"], .signup-btn a[href*="signup"]');
    const signOutButtons = document.querySelectorAll('.signout-btn, button.signout-btn, a.signout-btn');

    // Password toggle
    function initPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.show-password-btn');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const fieldId = btn.getAttribute('data-target') || btn.closest('.password-wrap')?.querySelector('input')?.id;
                if (!fieldId) return;
                const field = document.getElementById(fieldId);
                if (!field) return;

                if (field.type === 'password') {
                    field.type = 'text';
                    btn.textContent = 'Hide';
                } else {
                    field.type = 'password';
                    btn.textContent = 'Show';
                }
            });
        });
    }

    // Check login status
    try {
        const response = await fetch('api/whoami.php');
        const data = await response.json();
        if (data.success && data.user) {
            isLoggedIn = true;
            currentUser = data.user;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }

    // Update UI based on login status
    function updateAuthUI() {
        if (isLoggedIn) {
            signInButtons.forEach(btn => btn.style.display = 'none');
            signUpButtons.forEach(btn => (btn.closest('.signup-btn') ?? btn.parentElement)?.style.setProperty('display', 'none'));
            signOutButtons.forEach(btn => btn.style.display = 'block');
        } else {
            signInButtons.forEach(btn => btn.style.display = '');
            signUpButtons.forEach(btn => (btn.closest('.signup-btn') ?? btn.parentElement)?.style.setProperty('display', ''));
            signOutButtons.forEach(btn => btn.style.display = 'none');
        }
    }

    // Sign out function
    async function signOut() {
        try {
            const response = await fetch('api/signout.php', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                isLoggedIn = false;
                currentUser = null;
                updateAuthUI();
                window.location.href = 'index.html';
            } else {
                console.error('Sign out failed:', data.error);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Attach sign out handler
    document.addEventListener('click', e => {
        if (e.target.classList.contains('signout-btn') || e.target.closest('.signout-btn')) {
            e.preventDefault();
            signOut();
        }
    });

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('su-password').value;
            const password2 = document.getElementById('su-password2').value;

            if (password !== password2) {
                const msg = document.getElementById('su-msg');
                msg.textContent = 'Passwords do not match!';
                msg.style.color = 'red';
                return;
            }

            const formData = new FormData(signupForm);
            try {
                const res = await fetch('api/signup.php', { method: 'POST', body: formData });
                const data = await res.json();
                const msg = document.getElementById('su-msg');

                if (data.success) {
                    msg.textContent = 'Signup successful! Redirecting...';
                    msg.style.color = 'green';
                    setTimeout(() => window.location.href = 'signin.html', 1500);
                } else {
                    msg.textContent = data.error || 'Registration failed';
                    msg.style.color = 'red';
                }
            } catch (err) {
                const msg = document.getElementById('su-msg');
                msg.textContent = 'Error connecting to server';
                msg.style.color = 'red';
                console.error(err);
            }
        });
    }

    // Handle signin form submission
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signinForm);

            try {
                const res = await fetch('api/signin.php', { method: 'POST', body: formData });
                const data = await res.json();
                const msg = document.getElementById('si-msg');

                if (data.success) {
                    msg.textContent = 'Login successful! Redirecting...';
                    msg.style.color = 'green';
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    msg.textContent = data.error || 'Login failed';
                    msg.style.color = 'red';
                }
            } catch (err) {
                const msg = document.getElementById('si-msg');
                msg.textContent = 'Error connecting to server';
                msg.style.color = 'red';
                console.error(err);
            }
        });
    }

    // Initialize everything
    updateAuthUI();
    initPasswordToggle();

    // Export auth state
    window.authState = { isLoggedIn: () => isLoggedIn, getUser: () => currentUser, signOut };
})();
