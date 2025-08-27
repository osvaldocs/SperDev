import { post } from "../../service/api";

const API_URL = "http://localhost:3000/auth";

export function LoginUser () {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value; 
        try {
            const res = await post(API_URL, { email, password });

            if (res.message === "login successful") {
                localStorage.setItem("user", JSON.stringify(res.user));
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    });
};