import { navigate } from "../../router/router.js";
import { post } from "../../service/api.js";

const API_URL = "http://localhost:3000/auth";

export function LoginUser() {
  const form = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");

  // 🔐 Verificar si ya hay sesión activa
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    console.log(`Sesión activa: ${user.email}`);
    navigate("/home");
  }

  // 📝 Evento de login
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await post(API_URL, { email, user_password: password });
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
          console.log(`Login exitoso. Bienvenido, ${res.user.email}`);
          navigate("/home"); 
        } else {
          console.log(`Login fallido: ${res.message || "Credenciales inválidas"}`);
        }
      } catch (error) {
        console.error("Error durante el login:", error);
      }
    });
  }

  // 🚪 Evento de logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      console.log("Sesión cerrada.");
      navigate("/login");
    });
  }
}
