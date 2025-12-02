// controllers/baselineController.js
const Baseline = require("../models/Baseline");

// =============================================================
// VALIDADORES SEGÚN TIPO
// =============================================================

// Servidor
function validateServerConfig(config) {
    return config.puertosPermitidos && Array.isArray(config.puertosPermitidos);
}

// Router
function validateRouterConfig(config) {
    return config.rutasEstaticas || config.protocolos || config.interfaces;
}

// Firewall
function validateFirewallConfig(config) {
    return config.reglas && Array.isArray(config.reglas);
}

// Switch
function validateSwitchConfig(config) {
    return config.vlans || config.puertos;
}

// =============================================================
// VALIDAR CONFIG POR TIPO
// =============================================================
function validarConfigPorTipo(type, config) {
    switch (type) {
        case "server":
            return validateServerConfig(config);
        case "router":
            return validateRouterConfig(config);
        case "firewall":
            return validateFirewallConfig(config);
        case "switch":
            return validateSwitchConfig(config);
        default:
            return false;
    }
}

// =============================================================
// CONTROLADORES
// =============================================================

// Crear baseline
exports.crearBaseline = async (req, res) => {
    try {
        const { assetId, type, config } = req.body;

        if (!validarConfigPorTipo(type, config)) {
            return res.status(400).json({ error: "Config inválida para este tipo de activo" });
        }

        const baseline = new Baseline({
            assetId,
            type,
            config
        });

        await baseline.save();
        res.json({ msg: "Baseline creada", baseline });

    } catch (err) {
        console.error("Error en crearBaseline:", err);
        res.status(500).json({ error: "Error al crear baseline" });
    }
};

// Obtener baseline
exports.obtenerBaseline = async (req, res) => {
    try {
        const { id } = req.params;
        const baseline = await Baseline.findOne({ assetId: id });

        if (!baseline) {
            return res.status(404).json({ error: "Baseline no encontrada" });
        }

        res.json(baseline);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener baseline" });
    }
};

// Actualizar baseline
exports.actualizarBaseline = async (req, res) => {
    try {
        const { id } = req.params;
        const { config } = req.body;

        const baseline = await Baseline.findOne({ assetId: id });
        if (!baseline) return res.status(404).json({ error: "Baseline no encontrada" });

        if (!validarConfigPorTipo(baseline.type, config)) {
            return res.status(400).json({ error: "Config inválida para este tipo" });
        }

        baseline.config = config;
        baseline.lastUpdate = Date.now();

        await baseline.save();

        res.json({ msg: "Baseline actualizada", baseline });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar baseline" });
    }
};

// Listar baselines (cliente móvil)
exports.listarBaselines = async (_req, res) => {
    try {
        const list = await Baseline.find();
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: "Error al listar baselines" });
    }
};
