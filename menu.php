<?php
session_start();

if (!isset($_SESSION["loggeado"]) || $_SESSION["loggeado"] !== true) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Menú Principal</title>
<style>
body { font-family: Arial; background:#fafafa; padding:50px; text-align:center; }
h1 { color:#333; }
a {
    display:block;
    margin: 15px auto;
    padding: 12px;
    width: 250px;
    background: #1976d2;
    color: white;
    text-decoration: none;
    border-radius: 6px;
}
a:hover { background:#0f5aa0; }
</style>
</head>
<body>

<h1>Bienvenido <?= htmlspecialchars($_SESSION["usuario"]) ?></h1>

<a href="cliente1.php">Cliente 1 (CRUD + Estado)</a>
<a href="cliente2.php">Cliente 2 (Lectura S3)</a>
<a href="logout.php">Cerrar Sesión</a>

</body>
</html>
