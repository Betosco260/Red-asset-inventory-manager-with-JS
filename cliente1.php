<?php
session_start();
if (!isset($_SESSION["token"])) {
    header("Location: login.php");
    exit;
}
$TOKEN = $_SESSION["token"];
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cliente 1</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">

    <div class="card">
        <h2>Cliente 1 – Activos, Estado y Baselines</h2>
        <p>Sesión iniciada correctamente.</p>
    </div>

    <div class="card">
        <h2>Activos (CRUD via S1)</h2>
        <button onclick="getActivos()">GET Activos</button>

        <h3>Crear Activo</h3>
        <input id="name" placeholder="Nombre">
        <input id="ip" placeholder="IP">
        <input id="type" placeholder="Tipo (server/router/firewall)">
        <button onclick="crearActivo()">Crear</button>

        <pre id="output"></pre>
    </div>

    <div class="card">
        <h2>Consultar Estado</h2>
        <input id="estadoId" placeholder="ID del activo">
        <button onclick="consultarEstado()">Consultar</button>
        <pre id="estadoOut"></pre>
    </div>

    <div class="card">
        <h2>Comparar con Baseline</h2>
        <input id="compId" placeholder="ID del activo">
        <button onclick="comparar()">Comparar</button>
        <pre id="comparacionOut"></pre>
    </div>

</div>

<script>
let TOKEN = "<?= $TOKEN ?>";  // Token oculto
</script>

<script>


async function getActivos() {
    try {
        const res = await fetch("http://localhost:4001/activos", {
            headers: { "Authorization": TOKEN }
        });
        const data = await res.json();
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}

async function crearActivo() {
    try {
        const res = await fetch("http://localhost:4001/activos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": TOKEN
            },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                ip: document.getElementById("ip").value,
                type: document.getElementById("type").value
            })
        });
        const data = await res.json();
        document.getElementById("output").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}

async function consultarEstado() {
    try {
        const id = document.getElementById("estadoId").value;
        const res = await fetch(`http://localhost:4001/activos/${id}/estado`, {
            headers: { Authorization: TOKEN }
        });
        const data = await res.json();
        document.getElementById("estadoOut").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}

async function comparar() {
    try {
        const id = document.getElementById("compId").value;
        const res = await fetch(`http://localhost:4001/comparar/${id}`, {
            headers: { Authorization: TOKEN }
        });
        const data = await res.json();
        document.getElementById("comparacionOut").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}
</script>

</body>
</html>
