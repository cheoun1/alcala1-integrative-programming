document.addEventListener("DOMContentLoaded", () => {
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkAndReport = (input, isValid, message) => {
    input.setCustomValidity(isValid ? "" : message);
    return input.reportValidity();
  };

  const loginForm =
    document.querySelector('.login-signup-form[action="profile.html"]') ||
    document.querySelector(".login-signup-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const confirm = loginForm.querySelector("#confirm-password");
      if (confirm) {
        const username = loginForm.querySelector("#username");
        const email = loginForm.querySelector("#email");
        const password = loginForm.querySelector("#password");
        const confirmPassword = loginForm.querySelector("#confirm-password");

        let ok = true;
        if (!username || username.value.trim().length < 3) {
          ok = false;
          username && username.focus();
          checkAndReport(
            username,
            false,
            "Username must be at least 3 characters.",
          );
        }

        if (ok && (!email || !isValidEmail(email.value))) {
          ok = false;
          email && email.focus();
          checkAndReport(email, false, "Please enter a valid email address.");
        }

        if (ok && (!password || password.value.length < 8)) {
          ok = false;
          password && password.focus();
          checkAndReport(
            password,
            false,
            "Password must be at least 8 characters.",
          );
        }

        if (ok && password.value !== confirmPassword.value) {
          ok = false;
          confirmPassword && confirmPassword.focus();
          checkAndReport(confirmPassword, false, "Passwords do not match.");
        }

        if (!ok) e.preventDefault();
      } else {
        const email = loginForm.querySelector("#email");
        const password = loginForm.querySelector("#password");
        let ok = true;

        if (!email || !isValidEmail(email.value)) {
          ok = false;
          email && email.focus();
          checkAndReport(email, false, "Please enter a valid email address.");
        }

        if (ok && (!password || password.value.length < 6)) {
          ok = false;
          password && password.focus();
          checkAndReport(
            password,
            false,
            "Password must be at least 6 characters.",
          );
        }

        if (!ok) e.preventDefault();
      }
    });
  }

  const settingsForm = document.querySelector(".settings-form");
  if (settingsForm) {
    const saveBtn = settingsForm.querySelector(".save-btn");
    saveBtn &&
      saveBtn.addEventListener("click", (e) => {
        const email = settingsForm.querySelector("#email");
        const address = settingsForm.querySelector("#address");
        const password = settingsForm.querySelector("#password");

        let ok = true;
        if (email && !isValidEmail(email.value)) {
          ok = false;
          checkAndReport(email, false, "Please enter a valid email address.");
        }

        if (ok && address && address.value.trim().length === 0) {
          ok = false;
          checkAndReport(address, false, "Address cannot be empty.");
        }

        if (
          ok &&
          password &&
          password.value.length > 0 &&
          password.value.length < 8
        ) {
          ok = false;
          checkAndReport(
            password,
            false,
            "New password must be at least 8 characters.",
          );
        }

        if (!ok) {
          e.preventDefault();
          return;
        }

        alert("Settings validated and saved (demo).");
      });
  }
});
