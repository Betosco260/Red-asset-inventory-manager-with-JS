// controllers/authController.js (REEMPLAZAR)
const generateToken = require("../middleware/generateToken");

/**
 * Soporta tanto { username, password } como { user, pass }
 */
exports.login = (req, res) => {
    const { username, password, user, pass } = req.body;

    const usr = username || user;
    const pwd = password || pass;

    if (!usr || !pwd) {
        return res.status(400).json({ error: "Faltan credenciales" });
    }

    if (usr !== "admin" || pwd !== "admin123") {
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = generateToken(usr);
    res.json({ token });
};
