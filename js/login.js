document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("loginContainer");
  const registerLink = document.getElementById("registerLink");
  const backToLoginLink = document.getElementById("backToLoginLink");

  // Navegación entre Login y Registro
  registerLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.classList.add("rotated");
    loginContainer.style.minHeight = "550px";
  });
  backToLoginLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.classList.remove("rotated");
    loginContainer.style.minHeight = "450px";
  });

  // ---- LOGIN ----
  const loginForm = document.getElementById("loginForm");
  const emailLogin = document.getElementById("correoElectronico");
  const passwordLogin = document.getElementById("password");

  // Mostrar/ocultar reglas de email (Login)
  emailLogin.addEventListener("focus", () => {
    document.getElementById("emailRulesLogin").style.display = "block";
  });
  emailLogin.addEventListener("blur", () => {
    document.getElementById("emailRulesLogin").style.display = "none";
  });
  emailLogin.addEventListener("input", () => {
    checkEmailRules(emailLogin.value, "login-emailformat");
  });

  // Mostrar/ocultar reglas de contraseña (Login)
  passwordLogin.addEventListener("focus", () => {
    document.getElementById("passwordRulesLogin").style.display = "block";
  });
  passwordLogin.addEventListener("blur", () => {
    document.getElementById("passwordRulesLogin").style.display = "none";
  });
  passwordLogin.addEventListener("input", () => {
    checkPasswordRules(passwordLogin.value, "login-");
  });

  // Validación final al enviar el formulario de LOGIN
  loginForm.addEventListener("submit", function (event) {
    if (!isEmailValid(emailLogin.value)) {
      event.preventDefault();
      alert("El correo electrónico no cumple el formato válido (usuario@dominio.com).");
      return;
    }
    if (!isPasswordValid(passwordLogin.value)) {
      event.preventDefault();
      alert("La contraseña no cumple los requisitos indicados.");
    }
  });

  // ---- REGISTRO ----
  const registerForm = document.getElementById("registerForm");
  const emailRegister = document.getElementById("email");
  const passwordReg = document.getElementById("passwordReg");

  // Mostrar/ocultar reglas de email (Registro)
  emailRegister.addEventListener("focus", () => {
    document.getElementById("emailRulesRegister").style.display = "block";
  });
  emailRegister.addEventListener("blur", () => {
    document.getElementById("emailRulesRegister").style.display = "none";
  });
  emailRegister.addEventListener("input", () => {
    checkEmailRules(emailRegister.value, "register-emailformat");
  });

  // Mostrar/ocultar reglas de contraseña (Registro)
  passwordReg.addEventListener("focus", () => {
    document.getElementById("passwordRulesReg").style.display = "block";
  });
  passwordReg.addEventListener("blur", () => {
    document.getElementById("passwordRulesReg").style.display = "none";
  });
  passwordReg.addEventListener("input", () => {
    checkPasswordRules(passwordReg.value, "reg-");
  });

  // Validación final al enviar el formulario de REGISTRO
  registerForm.addEventListener("submit", function (event) {
    // Validar email
    if (!isEmailValid(emailRegister.value)) {
      event.preventDefault();
      alert("El correo electrónico no cumple el formato válido (usuario@dominio.com).");
      return;
    }
    // Validar password
    if (!isPasswordValid(passwordReg.value)) {
      event.preventDefault();
      alert("La contraseña no cumple los requisitos indicados.");
    }
  });

  // ---- Funciones de validación ----

  // Verifica formato de email (muy básico)
  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Muestra/oculta la regla de email (si se cumple o no)
  function checkEmailRules(email, ruleId) {
    const ruleEl = document.getElementById(ruleId);
    if (isEmailValid(email)) {
      ruleEl.style.display = "none";
    } else {
      ruleEl.style.display = "block";
    }
  }

  // Verifica si la contraseña cumple 3 reglas
  function isPasswordValid(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  }

  // Muestra/oculta reglas de contraseña
  function checkPasswordRules(password, prefix) {
    const lengthEl = document.getElementById(prefix + "length");
    const uppercaseEl = document.getElementById(prefix + "uppercase");
    const digitEl = document.getElementById(prefix + "digit");

    if (password.length >= 8) {
      lengthEl.style.display = "none";
    } else {
      lengthEl.style.display = "block";
    }
    if (/[A-Z]/.test(password)) {
      uppercaseEl.style.display = "none";
    } else {
      uppercaseEl.style.display = "block";
    }
    if (/\d/.test(password)) {
      digitEl.style.display = "none";
    } else {
      digitEl.style.display = "block";
    }
  }

  const BASE_URL = "52.200.144.251:8080";
  // Botones de Login con Google y GitHub
  document.getElementById("googleLogin").addEventListener("click", function () {
    window.location.href = BASE_URL +"/oauth2/authorization/google";
  });
  document.getElementById("githubLogin").addEventListener("click", function () {
    window.location.href = BASE_URL + "/oauth2/authorization/github";
  });

  async function checkLoginStatus() {
    try {
        const response = await fetch(BASE_URL + "/auth/user", {
            method: "GET",
            credentials: "include"  // Incluye la cookie en la solicitud
        });

        if (response.ok) {
            const user = await response.json();
            console.log("Usuario autenticado:", user);
        } else {
            console.warn("Usuario no autenticado.");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
    }
}


window.onload = checkLoginStatus;

});

