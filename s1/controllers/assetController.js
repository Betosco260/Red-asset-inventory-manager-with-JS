// controllers/assetController.js (REEMPLAZAR)
const axios = require("axios");
const { cache, updateCache } = require("../utils/cache");

// GET /activos  (proxy a S3)
exports.getAll = async (req, res) => {
    try {
        const resp = await axios.get(
            "http://localhost:4003/inventory",
            { headers: { Authorization: req.headers.authorization } }
        );
        updateCache("activos", resp.data.activos);
        res.json(resp.data);
    } catch (error) {
        // modo solo lectura: devolver cache
        return res.json({ modo: "solo lectura", activos: cache.activos });
    }
};

// POST /activos (proxy a S3)
exports.create = async (req, res) => {
    try {
        const resp = await axios.post(
            "http://localhost:4003/inventory",
            req.body,
            { headers: { Authorization: req.headers.authorization } }
        );
        res.json(resp.data);
    } catch (err) {
        res.status(500).json({ error: "Error al crear activo" });
    }
};

// PUT /activos/:id (proxy a S3)
exports.update = async (req, res) => {
    try {
        const resp = await axios.put(
            `http://localhost:4003/inventory/${req.params.id}`,
            req.body,
            { headers: { Authorization: req.headers.authorization } }
        );
        res.json(resp.data);
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar activo" });
    }
};

// DELETE /activos/:id (proxy a S3)
exports.delete = async (req, res) => {
    try {
        const resp = await axios.delete(
            `http://localhost:4003/inventory/${req.params.id}`,
            { headers: { Authorization: req.headers.authorization } }
        );
        res.json(resp.data);
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar activo" });
    }
};

// NEW: GET /activos/:id/estado  -> llama a S2 /rpc/get_status
exports.getEstado = async (req, res) => {
    try {
        const assetId = req.params.id;

        // Primero, pedir a S3 el activo para obtener su IP si hace falta
        let ip = null;
        try {
            const assetResp = await axios.get(`http://localhost:4003/inventory/${assetId}`, {
                headers: { Authorization: req.headers.authorization }
            });
            if (assetResp.data && assetResp.data.activo && assetResp.data.activo.ip) {
                ip = assetResp.data.activo.ip;
            }
        } catch (e) {
            // si no existe o S3 no responde, ip queda null y llamamos a S2 con assetId
        }

        const resp = await axios.post(
            "http://localhost:4002/rpc/get_status",
            { ip, assetId },
            { headers: { Authorization: req.headers.authorization } }
        );

        res.json(resp.data);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo estado (S2)" });
    }
};
