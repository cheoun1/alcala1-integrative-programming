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

        if (!ok) {
          e.preventDefault();
        } else {
          e.preventDefault();
          const emailVal =
            email && email.value ? email.value.trim().toLowerCase() : "";
          let userRole = "user";
          if (emailVal === "admin@example.com" || emailVal.includes("admin")) {
            userRole = "admin";
          }
          try {
            sessionStorage.setItem("userRole", userRole);
          } catch (err) {
            console.warn("Could not access sessionStorage", err);
          }

          if (userRole === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "profile.html";
          }
        }
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

  // ----- User count sync utilities -----
  const parseNumber = (text) => {
    if (!text && text !== 0) return 0;
    try {
      return parseInt(String(text).replace(/[,\s]/g, ""), 10) || 0;
    } catch (e) {
      return 0;
    }
  };

  const getStoredCount = () => {
    try {
      const v = localStorage.getItem("totalUsers");
      return v == null ? null : parseNumber(v);
    } catch (e) {
      return null;
    }
  };

  const setStoredCount = (n) => {
    try {
      localStorage.setItem("totalUsers", String(n));
    } catch (e) {
      /* ignore */
    }
  };

  const updateStatDisplays = (n) => {
    const el = document.getElementById("stat-total-users");
    if (el) el.innerText = Number(n).toLocaleString();
  };

  const computeInitialCount = () => {
    const table = document.querySelector("#users-table");
    if (table) {
      const rows = table.querySelectorAll("tbody tr");
      return rows.length;
    }
    const statEl = document.getElementById("stat-total-users");
    if (statEl) return parseNumber(statEl.innerText);
    return 0;
  };

  // ensure localStorage has a baseline value and update any visible stat
  (function initUserCount() {
    let stored = getStoredCount();
    if (stored === null) {
      stored = computeInitialCount();
      setStoredCount(stored);
    }
    updateStatDisplays(stored);
  })();

  // Protect admin pages and wire simple admin CRUD on manage-users
  const enforceAdminAccess = () => {
    const path = window.location.pathname.split("/").pop();
    const adminPages = ["admin.html", "manage-users.html", "manage-data.html"];
    if (adminPages.includes(path)) {
      const role = (sessionStorage.getItem("userRole") || "").toLowerCase();
      if (role !== "admin") {
        window.location.href = "login.html";
      }
    }
  };

  enforceAdminAccess();

  // Simple manage-users behavior: add/delete rows from a static table
  const usersTable = document.querySelector("#users-table");
  const addUserForm = document.querySelector("#add-user-form");
  if (usersTable && addUserForm) {
    const tbody = usersTable.querySelector("tbody");

    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = addUserForm.querySelector("#add-name").value.trim();
      const email = addUserForm.querySelector("#add-email").value.trim();
      const role = addUserForm.querySelector("#add-role").value;

      if (!name || !email) {
        alert("Name and email are required.");
        return;
      }

      const nextId = tbody.querySelectorAll("tr").length + 1;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nextId}</td>
        <td class="u-name">${name}</td>
        <td class="u-email">${email}</td>
        <td class="u-role">${role}</td>
        <td><button class="delete-user">Delete</button></td>
      `;
      tbody.appendChild(tr);
      addUserForm.reset();
      // increment stored total users and update stat displays
      try {
        const cur = getStoredCount() || 0;
        const next = cur + 1;
        setStoredCount(next);
        updateStatDisplays(next);
      } catch (err) {
        console.warn("Could not update stored user count", err);
      }
    });

    usersTable.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("delete-user")) {
        const tr = e.target.closest("tr");
        if (tr) {
          tr.remove();
          try {
            const cur = getStoredCount() || 0;
            const next = Math.max(0, cur - 1);
            setStoredCount(next);
            updateStatDisplays(next);
          } catch (err) {
            console.warn("Could not update stored user count", err);
          }
        }
      }
    });
  }
});
