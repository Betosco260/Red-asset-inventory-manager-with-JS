
const axios = require("axios");
const S1 = "http://localhost:4001";
const S3 = "http://localhost:4003";

let TOKEN = "";

async function login() {
  const r = await axios.post(`${S1}/auth/login`, { user: "admin", pass: "admin123" });
  TOKEN = r.data.token;
  console.log("[OK] Token S1 obtenido");
}

const assets = [
  {
    name: "Web Server 1",
    ip: "10.0.0.10",
    type: "server",
    description: "Apache web",
    baseline: {
      puertosPermitidos: [22, 80, 443],
      serviciosObligatorios: ["ssh", "httpd"],
      versionEsperada: "Ubuntu 22.04"
    }
  },
  {
    name: "DB Server 1",
    ip: "10.0.0.11",
    type: "server",
    description: "MySQL DB",
    baseline: {
      puertosPermitidos: [22, 3306],
      serviciosObligatorios: ["ssh", "mysqld"],
      versionEsperada: "MySQL 8.0"
    }
  },
  {
    name: "Core Router",
    ip: "10.0.0.1",
    type: "router",
    description: "Router principal",
    baseline: {
      rutasEstaticas: [
        { destino: "0.0.0.0/0", nextHop: "10.0.0.254" },
        { destino: "192.168.1.0/24", nextHop: "0.0.0.0" }
      ],
      protocolos: ["ospf"],
      interfaces: [
        { nombre: "eth0", ip: "10.0.0.1", estado: "up" },
        { nombre: "eth1", ip: "192.168.1.1", estado: "up" }
      ]
    }
  },
  {
    name: "Perimeter Firewall",
    ip: "10.0.0.2",
    type: "firewall",
    description: "Firewall perimetral",
    baseline: {
      reglas: [
        { accion: "permit", protocolo: "tcp", puerto: 443, origen: "any", destino: "any" },
        { accion: "deny", protocolo: "tcp", puerto: 23, origen: "any", destino: "any" }
      ],
      zonas: ["external", "internal"],
      serviciosPermitidos: ["ssh", "https"]
    }
  },
  {
    name: "Office Switch 1",
    ip: "10.0.0.20",
    type: "switch",
    description: "Switch de acceso",
    baseline: {
      vlans: [{ id: 1, name: "default" }, { id: 10, name: "offices" }],
      puertos: [
        { interfaz: "1/0/1", modo: "access", vlan: 10 },
        { interfaz: "1/0/2", modo: "trunk", vlan: null }
      ]
    }
  }
];

async function crearActivosYBaselines() {
  for (const a of assets) {
    try {
      const respA = await axios.post(`${S1}/activos`, {
        name: a.name,
        ip: a.ip,
        type: a.type,
        description: a.description
      }, { headers: { Authorization: TOKEN } });

      const id = respA.data.activo ? respA.data.activo._id : respA.data._id;
      console.log(`Activo creado: ${a.name} -> id=${id}`);

      const respB = await axios.post(`${S3}/baseline`, {
        assetId: id,
        type: a.type,
        config: a.baseline
      }, { headers: { Authorization: TOKEN } });

      console.log(`Baseline creada para ${a.name}`);

    } catch (err) {
      console.error("Error creando activo/baseline:", err.response?.data || err.message || err);
    }
  }

  console.log("Población finalizada.");
}

async function main() {
  await login();
  await crearActivosYBaselines();
}

main();
