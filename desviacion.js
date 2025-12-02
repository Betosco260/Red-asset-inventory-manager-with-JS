const fetch = require("node-fetch");

const S1_LOGIN = "http://localhost:4001/auth/login";
const S3_BASELINE = "http://localhost:4003/baseline";

const CREDS = { user: "admin", pass: "admin123" };

let TOKEN = null;


const IDS = {
    server1:  "691b9b04e19e0cbf674dee35",
    server2:  "691b9b04e19e0cbf674dee39",
    router1:  "691b9b04e19e0cbf674dee3d",
    firewall: "691b9b04e19e0cbf674dee41",
    switch1:  "691b9b04e19e0cbf674dee45"
};


async function login() {
    const res = await fetch(S1_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CREDS)
    });

    const data = await res.json();
    if (!data.token) throw new Error("No se obtuvo token");

    TOKEN = data.token;
    console.log("[OK] Token obtenido\n");
}


async function updateBaseline(assetId, config) {
    console.log(`[*] Modificando baseline de ${assetId}`);

    const res = await fetch(`${S3_BASELINE}/${assetId}`, {
        method: "PUT",
        headers: {
            "Authorization": TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ config })
    });

    const text = await res.text();
    console.log("[RESPUESTA]:", text, "\n");
}



const desviacionServer = {
    puertosPermitidos: [22, 80, 443, 9999],
    serviciosObligatorios: ["ssh", "httpd", "backdoorService"],
    versionEsperada: "Ubuntu 20.04"
};

const desviacionRouter = {
    rutasEstaticas: [
        { destino: "0.0.0.0/0", via: "10.0.0.1" },  
        { destino: "5.5.5.0/24", via: "10.0.0.123" } 
    ],
    protocolos: ["OSPF", "BGP"],
    interfaces: [
        { nombre: "eth0", estado: "up" },
        { nombre: "eth1", estado: "down" },
    ]
};

const desviacionFirewall = {
    reglas: [
        { action: "allow", proto: "tcp", port: 22 },
        { action: "allow", proto: "tcp", port: 443 },
        { action: "allow", proto: "tcp", port: 3389 },�
        { action: "allow", proto: "tcp", port: 23 } 
    ]
};

const desviacionSwitch = {
    vlans: [10, 20, 666], 
    puertos: [
        { id: 1, vlan: 10 },
        { id: 2, vlan: 20 },
        { id: 3, vlan: 666 } 
    ]
};


(async () => {
    try {
        await login();

        await updateBaseline(IDS.server1, desviacionServer);
        await updateBaseline(IDS.server2, desviacionServer);
        await updateBaseline(IDS.router1, desviacionRouter);
        await updateBaseline(IDS.firewall, desviacionFirewall);
        await updateBaseline(IDS.switch1, desviacionSwitch);

        console.log("✔ Desviaciones aplicadas. Ahora ejecuta COMPARACIÓN en S1.\n");
    } catch (err) {
        console.error("[ERROR]", err);
    }
})();
