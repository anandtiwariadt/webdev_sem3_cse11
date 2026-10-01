/**
 * Aventur - Dive into Unimaginable Dimensions
 * Landing Page + Sliding Auth + Interactive After-Login Dashboard
 * Backend Connected with userData.json via Node.js Server
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Application Views & User State
  // --------------------------------------------------------------------------
  const landingView = document.getElementById('landingView');
  const authView = document.getElementById('authView');
  const dashboardView = document.getElementById('dashboardView');

  // Backend API Base URL (Dynamic for local & production deployment)
  const API_BASE_URL = window.location.port === '3000' ? 'http://localhost:3001' : '';

  // Active mock user object
  let currentUser = {
    name: 'Akshat',
    email: 'akshat@dimension.com',
    memberSince: 'September 2026'
  };

  // --------------------------------------------------------------------------
  // Modal Utilities
  // --------------------------------------------------------------------------
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // --------------------------------------------------------------------------
  // View Router (Landing ↔ Auth ↔ Dashboard)
  // --------------------------------------------------------------------------
  const showView = (viewName, authMode = 'login') => {
    [landingView, authView, dashboardView].forEach((v) => {
      if (v) v.classList.remove('active');
    });

    const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');
    if (mobileDropdownMenu) mobileDropdownMenu.classList.remove('is-open');

    if (viewName === 'auth') {
      authView.classList.add('active');
      setAuthMode(authMode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'dashboard') {
      updateDashboardUI();
      fetchExplorersFromBackend();
      dashboardView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      landingView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update Dashboard Profile & Greeting
  const updateDashboardUI = () => {
    const firstName = currentUser.name.trim().split(' ')[0] || 'EXPLORER';
    const initial = firstName.charAt(0).toUpperCase();

    const dashGreeting = document.getElementById('dashGreeting');
    const userNavName = document.getElementById('userNavName');
    const userAvatar = document.getElementById('userAvatar');
    const profAvatarLarge = document.getElementById('profAvatarLarge');
    const profName = document.getElementById('profName');
    const profDetailName = document.getElementById('profDetailName');
    const profDetailEmail = document.getElementById('profDetailEmail');
    const profDetailDate = document.getElementById('profDetailDate');

    if (dashGreeting) dashGreeting.textContent = `WELCOME, ${currentUser.name.toUpperCase()}`;
    if (userNavName) userNavName.textContent = currentUser.name;
    if (userAvatar) userAvatar.textContent = initial;
    if (profAvatarLarge) profAvatarLarge.textContent = initial;
    if (profName) profName.textContent = currentUser.name;
    if (profDetailName) profDetailName.textContent = currentUser.name;
    if (profDetailEmail) profDetailEmail.textContent = currentUser.email;
    if (profDetailDate) profDetailDate.textContent = currentUser.memberSince;
  };

  // --------------------------------------------------------------------------
  // Backend Integration: Fetch All Users from Backend
  // --------------------------------------------------------------------------
  const fetchExplorersFromBackend = async () => {
    const tableBody = document.getElementById('explorersTableBody');
    const countBadge = document.getElementById('explorersCountBadge');

    try {
      const response = await fetch(`${API_BASE_URL}/employee`);
      if (!response.ok) throw new Error('Network response was not ok');
      const users = await response.json();

      if (countBadge) countBadge.textContent = `${users.length} Users`;

      if (!tableBody) return;

      if (!users || users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="table-loading">No registered users found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = users.map((user) => {
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        return `
          <tr>
            <td><span class="code-pill">#${user.id}</span></td>
            <td>
              <div class="explorer-cell-user">
                <div class="user-avatar-mini">${initial}</div>
                <div>
                  <span class="user-name-strong">${user.name || 'Unnamed User'}</span>
                </div>
              </div>
            </td>
            <td>${user.email || '—'}</td>
            <td><span class="role-tag-pill">${user.role || 'Dimension Traveler'}</span></td>
            <td>
              <div class="table-action-btns">
                <button 
                  type="button" 
                  class="btn-table edit-user-btn" 
                  data-userid="${user.id}"
                  data-username="${encodeURIComponent(user.name || '')}"
                  data-useremail="${encodeURIComponent(user.email || '')}"
                  data-userrole="${encodeURIComponent(user.role || '')}"
                  title="Edit user"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <button 
                  type="button" 
                  class="btn-table delete-user-btn" 
                  data-userid="${user.id}"
                  title="Delete user"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Attach edit modal triggers
      tableBody.querySelectorAll('.edit-user-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const userId = btn.getAttribute('data-userid');
          const userName = decodeURIComponent(btn.getAttribute('data-username') || '');
          const userEmail = decodeURIComponent(btn.getAttribute('data-useremail') || '');
          const userRole = decodeURIComponent(btn.getAttribute('data-userrole') || '');

          const editUserId = document.getElementById('editUserId');
          const editUserNameInput = document.getElementById('editUserNameInput');
          const editUserEmailInput = document.getElementById('editUserEmailInput');
          const editUserRoleInput = document.getElementById('editUserRoleInput');
          const editUserModal = document.getElementById('editUserModal');

          if (editUserId) editUserId.value = userId;
          if (editUserNameInput) editUserNameInput.value = userName;
          if (editUserEmailInput) editUserEmailInput.value = userEmail;
          if (editUserRoleInput) editUserRoleInput.value = userRole;

          if (editUserModal) {
            openModal(editUserModal);
            setTimeout(() => {
              if (editUserNameInput) editUserNameInput.focus();
            }, 100);
          }
        });
      });

      // Attach delete handlers
      tableBody.querySelectorAll('.delete-user-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const userId = btn.getAttribute('data-userid');
          await deleteUserFromBackend(userId);
        });
      });

    } catch (err) {
      console.warn('Backend server unavailable, using fallback mock data:', err);
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td><span class="code-pill">#1</span></td>
            <td>
              <div class="explorer-cell-user">
                <div class="user-avatar-mini">A</div>
                <div><span class="user-name-strong">Akshat</span></div>
              </div>
            </td>
            <td>akshat@dimension.com</td>
            <td><span class="role-tag-pill">Master Explorer</span></td>
            <td>
              <div class="table-action-btns">
                <button type="button" class="btn-table edit-user-btn" disabled>Edit</button>
                <button type="button" class="btn-table delete-user-btn" disabled>Delete</button>
              </div>
            </td>
          </tr>
        `;
      }
    }
  };

  // Delete user from backend
  const deleteUserFromBackend = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        showToast(`User #${userId} removed`, 'info');
        await fetchExplorersFromBackend();
      }
    } catch (err) {
      showToast('Error communicating with backend server', 'error');
    }
  };

  const refreshUsersBtn = document.getElementById('refreshUsersBtn');
  if (refreshUsersBtn) {
    refreshUsersBtn.addEventListener('click', async () => {
      showToast('Refreshing users...', 'info', 2000);
      await fetchExplorersFromBackend();
    });
  }

  // --------------------------------------------------------------------------
  // Navigation Event Triggers
  // --------------------------------------------------------------------------
  const backToLandingBtn = document.getElementById('backToLandingBtn');
  if (backToLandingBtn) backToLandingBtn.addEventListener('click', () => showView('landing'));

  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      showToast('Signed out of dimension portal.', 'info');
      showView('landing');
    });
  }

  const dashLogoBtn = document.getElementById('dashLogoBtn');
  if (dashLogoBtn) dashLogoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showView('landing');
  });

  const navLogoBtn = document.getElementById('navLogoBtn');
  if (navLogoBtn) navLogoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showView('landing');
  });

  // Login Triggers from Landing Page
  const loginTriggers = [
    document.getElementById('navLoginBtn'),
    document.getElementById('mobileNavLoginBtn'),
    document.getElementById('heroLoginBtn'),
    document.getElementById('bannerLoginBtn'),
    document.getElementById('footerLoginBtn')
  ];
  loginTriggers.forEach((btn) => {
    if (btn) btn.addEventListener('click', () => showView('auth', 'login'));
  });

  // Signup Triggers from Landing Page
  const signupTriggers = [
    document.getElementById('navSignupBtn'),
    document.getElementById('mobileNavSignupBtn'),
    document.getElementById('heroSignupBtn'),
    document.getElementById('bannerSignupBtn')
  ];
  signupTriggers.forEach((btn) => {
    if (btn) btn.addEventListener('click', () => showView('auth', 'signup'));
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');
  if (mobileMenuToggle && mobileDropdownMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileDropdownMenu.classList.toggle('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Exploration Cards on Landing Page
  document.querySelectorAll('.explore-card-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dest = btn.getAttribute('data-destination') || 'The Unknown';
      showToast(`Exploring ${dest}... Opening authentication portal.`, 'info');
      showView('auth', 'signup');
    });
  });

  // Resume Journey Activity Buttons on Dashboard
  document.querySelectorAll('.activity-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const exp = btn.getAttribute('data-exp') || 'Dimension';
      showToast(`Connecting to ${exp}... Dimension sync verified.`, 'success');
    });
  });

  // --------------------------------------------------------------------------
  // Sliding State Transition Controller (Login ↔ Signup)
  // --------------------------------------------------------------------------
  const authCard = document.getElementById('authCard');
  const loginPanel = document.getElementById('loginPanel');
  const signupPanel = document.getElementById('signupPanel');
  const loginPromoContent = document.getElementById('loginPromoContent');
  const signupPromoContent = document.getElementById('signupPromoContent');
  const switchToSignupBtn = document.getElementById('switchToSignupBtn');
  const switchToLoginBtn = document.getElementById('switchToLoginBtn');
  const mobileLoginTabBtn = document.getElementById('mobileLoginTabBtn');
  const mobileSignupTabBtn = document.getElementById('mobileSignupTabBtn');
  const toastContainer = document.getElementById('toastContainer');

  const setAuthMode = (mode) => {
    if (mode === 'signup') {
      authCard.classList.add('is-signup');
      loginPanel.setAttribute('aria-hidden', 'true');
      signupPanel.setAttribute('aria-hidden', 'false');

      loginPromoContent.classList.remove('active');
      signupPromoContent.classList.add('active');

      if (mobileSignupTabBtn && mobileLoginTabBtn) {
        mobileSignupTabBtn.classList.add('active');
        mobileLoginTabBtn.classList.remove('active');
      }

      setTimeout(() => {
        const nameInput = document.getElementById('signupNameInput');
        if (nameInput) nameInput.focus();
      }, 350);
    } else {
      authCard.classList.remove('is-signup');
      loginPanel.setAttribute('aria-hidden', 'false');
      signupPanel.setAttribute('aria-hidden', 'true');

      signupPromoContent.classList.remove('active');
      loginPromoContent.classList.add('active');

      if (mobileSignupTabBtn && mobileLoginTabBtn) {
        mobileLoginTabBtn.classList.add('active');
        mobileSignupTabBtn.classList.remove('active');
      }

      setTimeout(() => {
        const emailInput = document.getElementById('loginEmailInput');
        if (emailInput) emailInput.focus();
      }, 350);
    }
  };

  if (switchToSignupBtn) switchToSignupBtn.addEventListener('click', (e) => { e.preventDefault(); setAuthMode('signup'); });
  if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); setAuthMode('login'); });
  if (mobileLoginTabBtn) mobileLoginTabBtn.addEventListener('click', () => setAuthMode('login'));
  if (mobileSignupTabBtn) mobileSignupTabBtn.addEventListener('click', () => setAuthMode('signup'));

  // --------------------------------------------------------------------------
  // Toast Notification Utility
  // --------------------------------------------------------------------------
  const showToast = (message, type = 'info', duration = 4000) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  };

  // --------------------------------------------------------------------------
  // Password Visibility Toggles
  // --------------------------------------------------------------------------
  const setupPasswordToggle = (toggleBtnId, passwordInputId) => {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(passwordInputId);
    if (!btn || !input) return;

    const eyeShow = btn.querySelector('.eye-show');
    const eyeHide = btn.querySelector('.eye-hide');

    btn.addEventListener('click', () => {
      const isPass = input.getAttribute('type') === 'password';
      if (isPass) {
        input.setAttribute('type', 'text');
        btn.setAttribute('aria-label', 'Hide password');
        btn.setAttribute('title', 'Hide password');
        if (eyeShow) eyeShow.style.display = 'none';
        if (eyeHide) eyeHide.style.display = 'block';
      } else {
        input.setAttribute('type', 'password');
        btn.setAttribute('aria-label', 'Show password');
        btn.setAttribute('title', 'Show password');
        if (eyeShow) eyeShow.style.display = 'block';
        if (eyeHide) eyeHide.style.display = 'none';
      }
      input.focus();
    });
  };

  setupPasswordToggle('toggleLoginPasswordBtn', 'loginPasswordInput');
  setupPasswordToggle('toggleSignupPasswordBtn', 'signupPasswordInput');
  setupPasswordToggle('toggleSignupConfirmPasswordBtn', 'signupConfirmPasswordInput');

  // --------------------------------------------------------------------------
  // Validation Helpers
  // --------------------------------------------------------------------------
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const clearFieldError = (group, errorEl) => {
    if (group) group.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  };

  const setFieldError = (group, errorEl, message) => {
    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  };

  const showFormAlert = (alertEl, type, message) => {
    if (!alertEl) return;
    alertEl.className = `form-alert alert-${type}`;
    const textSpan = alertEl.querySelector('.alert-text') || alertEl;
    textSpan.textContent = message;
    alertEl.hidden = false;
  };

  const hideFormAlert = (alertEl) => {
    if (!alertEl) return;
    alertEl.hidden = true;
    alertEl.className = 'form-alert';
  };

  // --------------------------------------------------------------------------
  // LOGIN FORM CONTROLLER
  // --------------------------------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  const loginEmailInput = document.getElementById('loginEmailInput');
  const loginPasswordInput = document.getElementById('loginPasswordInput');
  const loginEmailGroup = document.getElementById('loginEmailGroup');
  const loginPasswordGroup = document.getElementById('loginPasswordGroup');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPasswordError = document.getElementById('loginPasswordError');
  const loginRememberMeCheckbox = document.getElementById('loginRememberMeCheckbox');
  const signInBtn = document.getElementById('signInBtn');
  const loginAlert = document.getElementById('loginAlert');
  const googleSignInBtn = document.getElementById('googleSignInBtn');

  // Load Saved Remember Me State
  const savedRemember = localStorage.getItem('adv_remember_me');
  const savedEmail = localStorage.getItem('adv_saved_email');
  if (savedRemember === 'true' && savedEmail && loginEmailInput && loginRememberMeCheckbox) {
    loginEmailInput.value = savedEmail;
    loginRememberMeCheckbox.checked = true;
  }

  loginEmailInput.addEventListener('input', () => {
    clearFieldError(loginEmailGroup, loginEmailError);
    hideFormAlert(loginAlert);
  });

  loginPasswordInput.addEventListener('input', () => {
    clearFieldError(loginPasswordGroup, loginPasswordError);
    hideFormAlert(loginAlert);
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFormAlert(loginAlert);

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;
    let hasError = false;

    if (!email) {
      setFieldError(loginEmailGroup, loginEmailError, 'Please enter your email');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError(loginEmailGroup, loginEmailError, 'Please enter a valid email format');
      hasError = true;
    } else {
      clearFieldError(loginEmailGroup, loginEmailError);
    }

    if (!password) {
      setFieldError(loginPasswordGroup, loginPasswordError, 'Please enter your password');
      hasError = true;
    } else if (password.length < 6) {
      setFieldError(loginPasswordGroup, loginPasswordError, 'Password must be at least 6 characters');
      hasError = true;
    } else {
      clearFieldError(loginPasswordGroup, loginPasswordError);
    }

    if (hasError) {
      if (!email || !isValidEmail(email)) loginEmailInput.focus();
      else loginPasswordInput.focus();
      return;
    }

    if (loginRememberMeCheckbox.checked) {
      localStorage.setItem('adv_remember_me', 'true');
      localStorage.setItem('adv_saved_email', email);
    } else {
      localStorage.removeItem('adv_remember_me');
      localStorage.removeItem('adv_saved_email');
    }

    // Set user state
    const extractedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Explorer';
    currentUser.name = extractedName;
    currentUser.email = email;

    // Simulate login loading state
    signInBtn.classList.add('is-loading');
    signInBtn.disabled = true;
    loginEmailInput.disabled = true;
    loginPasswordInput.disabled = true;

    setTimeout(() => {
      signInBtn.classList.remove('is-loading');
      signInBtn.disabled = false;
      loginEmailInput.disabled = false;
      loginPasswordInput.disabled = false;

      // Navigate to Dashboard
      showView('dashboard');
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
    }, 750);
  });

  // Google Sign In
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
      showToast('Connecting to Google...', 'info', 1200);
      currentUser.name = 'Alex Rivera';
      currentUser.email = 'alex.rivera@gmail.com';
      currentUser.memberSince = 'September 2026';

      setTimeout(() => {
        showView('dashboard');
        showToast(`Signed in with Google as ${currentUser.name}`, 'success');
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // SIGNUP FORM CONTROLLER (Connects with POST /create in userData.json)
  // --------------------------------------------------------------------------
  const signupForm = document.getElementById('signupForm');
  const signupNameInput = document.getElementById('signupNameInput');
  const signupEmailInput = document.getElementById('signupEmailInput');
  const signupPasswordInput = document.getElementById('signupPasswordInput');
  const signupConfirmPasswordInput = document.getElementById('signupConfirmPasswordInput');
  const signupTermsCheckbox = document.getElementById('signupTermsCheckbox');
  const signupNameGroup = document.getElementById('signupNameGroup');
  const signupEmailGroup = document.getElementById('signupEmailGroup');
  const signupPasswordGroup = document.getElementById('signupPasswordGroup');
  const signupConfirmPasswordGroup = document.getElementById('signupConfirmPasswordGroup');
  const signupTermsGroup = document.getElementById('signupTermsGroup');
  const signupNameError = document.getElementById('signupNameError');
  const signupEmailError = document.getElementById('signupEmailError');
  const signupPasswordError = document.getElementById('signupPasswordError');
  const signupConfirmPasswordError = document.getElementById('signupConfirmPasswordError');
  const signupTermsError = document.getElementById('signupTermsError');
  const createAccountBtn = document.getElementById('createAccountBtn');
  const signupAlert = document.getElementById('signupAlert');
  const termsLink = document.getElementById('termsLink');

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Terms & Conditions: Dimension Exploration Agreement.', 'info');
    });
  }

  [signupNameInput, signupEmailInput, signupPasswordInput, signupConfirmPasswordInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        hideFormAlert(signupAlert);
      });
    }
  });

  signupNameInput.addEventListener('input', () => clearFieldError(signupNameGroup, signupNameError));
  signupEmailInput.addEventListener('input', () => clearFieldError(signupEmailGroup, signupEmailError));
  signupPasswordInput.addEventListener('input', () => clearFieldError(signupPasswordGroup, signupPasswordError));
  signupConfirmPasswordInput.addEventListener('input', () => clearFieldError(signupConfirmPasswordGroup, signupConfirmPasswordError));
  signupTermsCheckbox.addEventListener('change', () => clearFieldError(signupTermsGroup, signupTermsError));

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormAlert(signupAlert);

    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;
    const agreedTerms = signupTermsCheckbox.checked;
    let hasError = false;

    if (!name) {
      setFieldError(signupNameGroup, signupNameError, 'Please enter your name');
      hasError = true;
    } else if (name.length < 2) {
      setFieldError(signupNameGroup, signupNameError, 'Name must be at least 2 characters');
      hasError = true;
    } else {
      clearFieldError(signupNameGroup, signupNameError);
    }

    if (!email) {
      setFieldError(signupEmailGroup, signupEmailError, 'Please enter your email');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError(signupEmailGroup, signupEmailError, 'Please enter a valid email format');
      hasError = true;
    } else {
      clearFieldError(signupEmailGroup, signupEmailError);
    }

    if (!password) {
      setFieldError(signupPasswordGroup, signupPasswordError, 'Please create a password');
      hasError = true;
    } else if (password.length < 6) {
      setFieldError(signupPasswordGroup, signupPasswordError, 'Password must be at least 6 characters');
      hasError = true;
    } else {
      clearFieldError(signupPasswordGroup, signupPasswordError);
    }

    if (!confirmPassword) {
      setFieldError(signupConfirmPasswordGroup, signupConfirmPasswordError, 'Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setFieldError(signupConfirmPasswordGroup, signupConfirmPasswordError, 'Passwords do not match');
      hasError = true;
    } else {
      clearFieldError(signupConfirmPasswordGroup, signupConfirmPasswordError);
    }

    if (!agreedTerms) {
      setFieldError(signupTermsGroup, signupTermsError, 'You must agree to the Terms & Conditions.');
      hasError = true;
    } else {
      clearFieldError(signupTermsGroup, signupTermsError);
    }

    if (hasError) {
      if (!name) signupNameInput.focus();
      else if (!email || !isValidEmail(email)) signupEmailInput.focus();
      else if (!password) signupPasswordInput.focus();
      else if (!confirmPassword || password !== confirmPassword) signupConfirmPasswordInput.focus();
      return;
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.memberSince = 'September 2026';

    createAccountBtn.classList.add('is-loading');
    createAccountBtn.disabled = true;

    // Send new user to backend server (saving in userData.json)
    try {
      await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          role: 'Quantum Voyager',
          memberSince: 'September 2026',
          destinations: 1
        })
      });
    } catch (err) {
      console.warn('Backend server save error (fallback mode):', err);
    }

    setTimeout(() => {
      createAccountBtn.classList.remove('is-loading');
      createAccountBtn.disabled = false;
      signupForm.reset();

      // Navigate to Dashboard
      showView('dashboard');
      showToast(`Account created for ${currentUser.name}!`, 'success', 4500);
    }, 850);
  });



  
  const editUserModal = document.getElementById('editUserModal');
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editUserForm = document.getElementById('editUserForm');
  const editUserId = document.getElementById('editUserId');
  const editUserNameInput = document.getElementById('editUserNameInput');
  const editUserEmailInput = document.getElementById('editUserEmailInput');
  const editUserRoleInput = document.getElementById('editUserRoleInput');
  const saveEditBtn = document.getElementById('saveEditBtn');

  if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', () => closeModal(editUserModal));
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => closeModal(editUserModal));

  if (editUserModal) {
    editUserModal.addEventListener('click', (e) => {
      if (e.target === editUserModal) closeModal(editUserModal);
    });
  }

  if (editUserForm) {
    editUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editUserId.value;
      const name = editUserNameInput.value.trim();
      const email = editUserEmailInput.value.trim();
      const role = editUserRoleInput.value.trim();

      if (!name || !email) {
        showToast('Name and email are required to update user.', 'error');
        return;
      }

      if (saveEditBtn) {
        saveEditBtn.classList.add('is-loading');
        saveEditBtn.disabled = true;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/edit/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role })
        });

        if (response.ok) {
          // If current logged-in user was updated, update current session name & dashboard greeting
          if (currentUser.email === email || currentUser.name === name || id === '1') {
            currentUser.name = name;
            currentUser.email = email;
            updateDashboardUI();
          }

          closeModal(editUserModal);
          showToast(`User "${name}" updated successfully`, 'success');
          await fetchExplorersFromBackend();
        } else {
          showToast('Failed to update user record.', 'error');
        }
      } catch (err) {
        console.error('Error updating user:', err);
        showToast('Error communicating with backend server', 'error');
      } finally {
        if (saveEditBtn) {
          saveEditBtn.classList.remove('is-loading');
          saveEditBtn.disabled = false;
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // FORGOT PASSWORD MODAL
  // --------------------------------------------------------------------------
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const closeForgotModalBtn = document.getElementById('closeForgotModalBtn');
  const cancelForgotBtn = document.getElementById('cancelForgotBtn');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const forgotEmailInput = document.getElementById('forgotEmailInput');
  const forgotEmailError = document.getElementById('forgotEmailError');

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginEmailInput.value && isValidEmail(loginEmailInput.value)) {
        forgotEmailInput.value = loginEmailInput.value;
      }
      openModal(forgotPasswordModal);
      setTimeout(() => forgotEmailInput.focus(), 100);
    });
  }

  if (closeForgotModalBtn) closeForgotModalBtn.addEventListener('click', () => closeModal(forgotPasswordModal));
  if (cancelForgotBtn) cancelForgotBtn.addEventListener('click', () => closeModal(forgotPasswordModal));

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = forgotEmailInput.value.trim();
      if (!email || !isValidEmail(email)) {
        forgotEmailError.textContent = 'Please enter a valid email address';
        forgotEmailInput.focus();
        return;
      }
      forgotEmailError.textContent = '';
      closeModal(forgotPasswordModal);
      showToast(`Password reset link sent to ${email}.`, 'success');
    });
  }

  if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener('click', (e) => {
      if (e.target === forgotPasswordModal) closeModal(forgotPasswordModal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (forgotPasswordModal && forgotPasswordModal.classList.contains('is-active')) {
        closeModal(forgotPasswordModal);
      }
      if (editUserModal && editUserModal.classList.contains('is-active')) {
        closeModal(editUserModal);
      }
    }
  });
});
