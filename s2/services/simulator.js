// services/simulator.js

 //Simulador que devuelve un estado "realista" según type/assetId/ip
function simulateByType(typeOrId) {
    // default server-like
    const baseServer = {
        status: "UP",
        openPorts: [22, 80, 443],
        version: "OS 4.1",
        services: ["ssh", "http", "https"]
    };

    // router
    const baseRouter = {
        status: "UP",
        version: "RouterOS 7.5",
        interfaces: [
            { name: "eth0", ip: "10.0.0.1", up: true },
            { name: "eth1", ip: "192.168.1.1", up: true }
        ],
        routingTable: [
            { destino: "0.0.0.0/0", nextHop: "10.0.0.254" },
            { destino: "192.168.1.0/24", nextHop: "0.0.0.0" }
        ],
        protocols: ["ospf"]
    };

    // firewall
    const baseFirewall = {
        status: "UP",
        version: "FW-OS 6.0",
        rulesActive: [
            { id: 1, action: "permit", protocol: "tcp", port: 443, src: "any", dst: "any" },
            { id: 2, action: "deny", protocol: "tcp", port: 23, src: "any", dst: "any" }
        ],
        zones: ["internal", "external"]
    };

    // switch
    const baseSwitch = {
        status: "UP",
        version: "IOS 15",
        vlans: [{ id: 1, name: "default" }, { id: 10, name: "offices" }],
        ports: [
            { iface: "1/0/1", mode: "access", vlan: 10, up: true },
            { iface: "1/0/2", mode: "trunk", vlan: null, up: true }
        ]
    };

    const s = (typeOrId || "").toString().toLowerCase();

    // detección simple
    if (s.includes("router")) return baseRouter;
    if (s.includes("firewall") || s.includes("fw")) return baseFirewall;
    if (s.includes("switch") || s.includes("sw")) return baseSwitch;

    // por default, server
    return baseServer;
}

module.exports = { simulateByType };

