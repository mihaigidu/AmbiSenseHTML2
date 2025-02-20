document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("loginContainer");
  // Ahora usamos loginLink para pasar al formulario de LOGIN (back)
  const loginLink = document.getElementById("loginLink");
  // Y backToRegisterLink para volver al formulario de REGISTRO (front)
  const backToRegisterLink = document.getElementById("backToRegisterLink");

  // Navegación: de REGISTRO (front) a LOGIN (back)
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.classList.add("rotated");
    // Ajusta la altura mínima para el formulario de login (si es menor)
    loginContainer.style.minHeight = "450px";
  });
  
  // Navegación: de LOGIN (back) a REGISTRO (front)
  backToRegisterLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.classList.remove("rotated");
    loginContainer.style.minHeight = "550px";
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
    if (!isEmailValid(emailRegister.value)) {
      event.preventDefault();
      alert("El correo electrónico no cumple el formato válido (usuario@dominio.com).");
      return;
    }
    if (!isPasswordValid(passwordReg.value)) {
      event.preventDefault();
      alert("La contraseña no cumple los requisitos indicados.");
    }
  });

  // ---- Funciones de validación ----
  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function checkEmailRules(email, ruleId) {
    const ruleEl = document.getElementById(ruleId);
    ruleEl.style.display = isEmailValid(email) ? "none" : "block";
  }
  function isPasswordValid(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  }
  function checkPasswordRules(password, prefix) {
    const lengthEl = document.getElementById(prefix + "length");
    const uppercaseEl = document.getElementById(prefix + "uppercase");
    const digitEl = document.getElementById(prefix + "digit");

    lengthEl.style.display = password.length >= 8 ? "none" : "block";
    uppercaseEl.style.display = /[A-Z]/.test(password) ? "none" : "block";
    digitEl.style.display = /\d/.test(password) ? "none" : "block";
  }

  // Botones de Login con Google y GitHub
  document.getElementById("googleLogin").addEventListener("click", function () {
    window.location.href = "http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/oauth2/authorization/google";
  });
  document.getElementById("githubLogin").addEventListener("click", function () {
    window.location.href = "http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/oauth2/authorization/github";
  });

  async function checkLoginStatus() {
    try {
      const response = await fetch("http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/auth/user", {
        credentials: "include"
      });
      if (response.ok) {
        const user = await response.json();
        console.log("Usuario autenticado:", user);
        document.getElementById("loginForm").style.display = "none";
        // Si cuentas con un botón de logout, se muestra aquí (id "logoutButton")
        document.getElementById("logoutButton").style.display = "block";
      } else {
        console.log("Usuario no autenticado.");
      }
    } catch (error) {
      console.error("Error al verificar la sesión:", error);
    }
  }
  window.onload = checkLoginStatus;
});
