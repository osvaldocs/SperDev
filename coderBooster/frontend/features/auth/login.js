import { post } from "../../service/api.js";

const API_URL = "http://localhost:3000/auth";

export function LoginUser () {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value; 
        try {
            const res = await post(API_URL, { email, user_password: password });
            console.log("Backend response:", res); 
            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
                console.log(`Login successful. Welcome, ${res.user.email}`);

                // dashboard would go here, e.g.: window.location.href = "/dashboard.html";
            } else {
                console.log(`Login failed: ${res.message || "Invalid credentials"}`);
            }
        } catch (error){
            console.error("Error during login:", error);
            }

    });
};

LoginUser();