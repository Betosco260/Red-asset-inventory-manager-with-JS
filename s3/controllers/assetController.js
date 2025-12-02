const Asset = require("../models/Asset");

// GET /inventory
exports.getAll = async (req, res) => {
    try {
        const data = await Asset.find({});
        res.json({ activos: data });
    } catch {
        res.status(500).json({ error: "Error al obtener activos" });
    }
};

// GET /inventory/:id
exports.getOne = async (req, res) => {
    try {
        const act = await Asset.findById(req.params.id);
        if (!act) return res.status(404).json({ error: "No encontrado" });
        res.json({ activo: act });
    } catch {
        res.status(500).json({ error: "Error interno" });
    }
};

// POST /inventory
exports.create = async (req, res) => {
    try {
        const nuevo = new Asset(req.body);
        await nuevo.save();
        res.json({ mensaje: "Activo creado", activo: nuevo });
    } catch {
        res.status(500).json({ error: "Error al crear activo" });
    }
};

// PUT /inventory/:id
exports.update = async (req, res) => {
    try {
        const act = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!act) return res.status(404).json({ error: "No encontrado" });
        res.json({ mensaje: "Actualizado", activo: act });
    } catch {
        res.status(500).json({ error: "Error al actualizar activo" });
    }
};

// DELETE /inventory/:id
exports.delete = async (req, res) => {
    try {
        const eliminado = await Asset.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: "No encontrado" });
        res.json({ mensaje: "Eliminado", activo: eliminado });
    } catch {
        res.status(500).json({ error: "Error al eliminar activo" });
    }
};
