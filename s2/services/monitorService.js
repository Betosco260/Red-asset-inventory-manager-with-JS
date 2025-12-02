// services/monitorService.js
const axios = require("axios");
const { simulateByType } = require("./simulator");
const telegram = require("../utils/telegram");

// Comparadores por tipo
function compareServer(simulated, baseline) {
    const desviaciones = [];
    const basePorts = (baseline.config && baseline.config.puertosPermitidos) || [];
    const actualPorts = simulated.openPorts || [];

    basePorts.forEach(p => {
        if (!actualPorts.includes(p)) desviaciones.push(`Puerto seguro ${p} NO está abierto`);
    });

    actualPorts.forEach(p => {
        if (!basePorts.includes(p)) desviaciones.push(`Puerto inesperado abierto: ${p}`);
    });

    const baseSvc = (baseline.config && baseline.config.serviciosObligatorios) || [];
    baseSvc.forEach(svc => {
        if (!(simulated.services || []).includes(svc)) desviaciones.push(`Servicio faltante: ${svc}`);
    });

    if (simulated.status === "DOWN") desviaciones.push("Activo DOWN");
    return desviaciones;
}

function compareRouter(simulated, baseline) {
    const desviaciones = [];
    const baseRoutes = (baseline.config && baseline.config.rutasEstaticas) || [];
    const actualRoutes = simulated.routingTable || [];

    baseRoutes.forEach(br => {
        const found = actualRoutes.find(ar => ar.destino === br.destino && ar.nextHop === br.nextHop);
        if (!found) desviaciones.push(`Ruta esperada no encontrada: ${br.destino} via ${br.nextHop}`);
    });

    const baseProto = (baseline.config && baseline.config.protocolos) || [];
    baseProto.forEach(p => {
        if (!((simulated.protocols || []).includes(p))) desviaciones.push(`Protocolo esperado ausente: ${p}`);
    });

    if (simulated.status === "DOWN") desviaciones.push("Activo DOWN");
    return desviaciones;
}

function compareFirewall(simulated, baseline) {
    const desviaciones = [];
    const baseRules = (baseline.config && baseline.config.reglas) || [];
    const actualRules = simulated.rulesActive || simulated.rules || [];

    baseRules.forEach(br => {
        const found = actualRules.find(ar =>
            ar.action === br.action &&
            String(ar.port) === String(br.port) &&
            ar.protocol === br.protocol &&
            (br.origen ? ar.src === br.origen : true) &&
            (br.destino ? ar.dst === br.destino : true)
        );
        if (!found) desviaciones.push(`Regla esperada no encontrada: ${br.action} ${br.protocol}/${br.port}`);
    });

    if (simulated.status === "DOWN") desviaciones.push("Activo DOWN");
    return desviaciones;
}

function compareSwitch(simulated, baseline) {
    const desviaciones = [];
    const baseVlans = (baseline.config && baseline.config.vlans) || [];
    const actualVlans = simulated.vlans || [];

    baseVlans.forEach(bv => {
        const found = actualVlans.find(av => av.id === bv.id || av.name === bv.name);
        if (!found) desviaciones.push(`VLAN esperada no encontrada: ${bv.id || bv.name}`);
    });

    if (simulated.status === "DOWN") desviaciones.push("Activo DOWN");
    return desviaciones;
}

function buildAlertMessage({ assetId, ip, baseline, simulated, desviaciones }) {
    const id = assetId || ip || "desconocido";
    const lines = [];
    lines.push(`⚠️ Desviación detectada en activo: ${id}`);
    if (ip) lines.push(`IP: ${ip}`);
    lines.push(`Tipo: ${baseline ? baseline.type : "unknown"}`);
    lines.push(`Estado actual: ${simulated.status}`);
    lines.push("Desviaciones:");
    desviaciones.forEach(d => lines.push(` - ${d}`));
    lines.push(`Timestamp: ${new Date().toISOString()}`);
    return lines.join("\n");
}

async function getStatus({ ip, assetId, callerToken }) {

    // 1) obtener baseline primero
    let baseline = null;
    try {
        const resp = await axios.get(`http://localhost:4003/baseline/${assetId}`, {
            headers: { Authorization: callerToken }
        });
        baseline = resp.data.baseline || resp.data;
    } catch (err) {
        return {
            estado: null,
            baseline: null,
            desviaciones: ["S3 indisponible o baseline no encontrada"],
            warning: true
        };
    }

    // validar baseline
    if (!baseline || !baseline.type) {
        return {
            estado: null,
            baseline,
            desviaciones: ["Baseline inválido o sin tipo"],
            warning: true
        };
    }

    // 2) simular AHORA sí con el tipo correcto
    const simulated = simulateByType(baseline.type);

    // 3) comparar
    const type = baseline.type;
    let desviaciones = [];

    if (type === "server") desviaciones = compareServer(simulated, baseline);
    else if (type === "router") desviaciones = compareRouter(simulated, baseline);
    else if (type === "firewall") desviaciones = compareFirewall(simulated, baseline);
    else if (type === "switch") desviaciones = compareSwitch(simulated, baseline);
    else desviaciones.push("Tipo de activo desconocido para comparar");

    // 4) enviar alerta si aplica
    if (desviaciones.length > 0) {
        const msg = buildAlertMessage({ assetId, ip, baseline, simulated, desviaciones });
        try {
            await telegram.sendAlert(msg);
        } catch (err) {
            console.error("Error enviando alerta:", err.message || err);
        }
    }

    return {
        estado: simulated,
        baseline,
        desviaciones
    };
}

// discover
async function discover({ networkSegment }) {
    const list = [];
    for (let i = 1; i <= 3; i++) {
        const assetId = `${networkSegment || "net"}-host-${i}`;
        list.push({
            assetId,
            ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            type: ["server", "router", "firewall", "switch"][Math.floor(Math.random() * 4)]
        });
    }
    return { discovered: list, count: list.length };
}

module.exports = { getStatus, discover };

