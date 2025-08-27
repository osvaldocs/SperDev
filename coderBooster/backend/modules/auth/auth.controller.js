import { findEmail } from "./auth.model";

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await findEmail(email);
    if (!user) {
        return res.json({ message: "user no find" });
    }
    if (user.password !== password) {
        return res.json({ message: "Invalid email or password" });
    }
}