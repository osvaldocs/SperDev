import { navigate } from "../../router/router.js";
import { post } from "../../service/api.js";

const API_URL = "http://localhost:3000/auth";

export function LoginUser() {
  const form = document.getElementById("login-form");
  if (!form) {
    console.warn("login-form no encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await post(API_URL, { email, user_password: password });
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        console.log(localStorage.getItem("user"));
        console.log(`Login successful. Welcome, ${res.user.email}`);
        navigate("/home"); // ✅ Navegamos solo si hay login
      } else {
        console.log(`Login failed: ${res.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
}
