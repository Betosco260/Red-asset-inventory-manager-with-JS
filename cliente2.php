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
    <title>Cliente 2</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">

    <div class="card">
        <h2>Cliente 2 – Lectura de S3</h2>
        <p>Sesión iniciada correctamente.</p>
    </div>

    <div class="card">
        <button onclick="getActivos()">Ver Activos</button>
        <button onclick="getBaselines()">Ver Baselines</button>
        <pre id="out"></pre>
    </div>

</div>

<script>
let TOKEN = "<?= $TOKEN ?>"; // Token oculto
</script>

<script>

async function getActivos() {
    try {
        const res = await fetch("http://localhost:4003/inventory", {
            headers: { Authorization: TOKEN }
        });
        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}

async function getBaselines() {
    try {
        const res = await fetch("http://localhost:4003/baselines", {
            headers: { Authorization: TOKEN }
        });
        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
    } catch (err) { alert("Error: " + err); }
}
</script>

</body>
</html>
