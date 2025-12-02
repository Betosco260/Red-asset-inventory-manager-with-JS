const jwt = require("jsonwebtoken");

module.exports = (user) => {
    return jwt.sign(
        { user },
        "CLAVE_SECRETA_S1",
        { expiresIn: "2h" }
    );
};
