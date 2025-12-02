// controllers/compareController.js
const axios = require("axios");

exports.compare = async (req, res) => {
    const assetId = req.params.assetId;

    try {
        // Llamada a S2 para obtener estado y comparación (S2 obtendrá baseline desde S3)
        const respuesta = await axios.post(
            "http://localhost:4002/rpc/get_status",
            { assetId },
            { headers: { Authorization: req.headers.authorization } }
        );

        res.json(respuesta.data);
    } catch (err) {
        console.error("Error compareController S1:", err.message || err);
        res.status(500).json({ error: "Error al comparar (S2 o S3 no disponibles)" });
    }
};
