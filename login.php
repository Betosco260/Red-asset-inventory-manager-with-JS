<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $user = $_POST["user"] ?? "";
    $pass = $_POST["pass"] ?? "";

    $url = "http://localhost:4001/auth/login";

    $data = json_encode([
        "user" => $user,
        "pass" => $pass
    ]);

    $options = [
        "http" => [
            "header"  => "Content-type: application/json\r\n",
            "method"  => "POST",
            "content" => $data
        ]
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result, true);

    if (isset($response["token"])) {

        $_SESSION["token"] = $response["token"];
        $_SESSION["usuario"] = $user;
        $_SESSION["loggeado"] = true;

        header("Location: menu.php");
        exit;

    } else {
        $error = "Usuario o contraseña incorrectos";
    }
}
?>

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
            background-size: 400% 400%;
            animation: gradientMove 12s ease infinite;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .login-box {
            background: white;
            width: 380px;
            padding: 35px;
            border-radius: 15px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.25);
            text-align: center;
            animation: fadeIn 0.9s ease-in-out;
        }

        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(25px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        h2 {
            margin-bottom: 25px;
            color: #1565c0;
            font-weight: bold;
            font-size: 28px;
        }

        input {
            width: 90%;
            padding: 13px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: 0.2s;
        }

        input:focus {
            border-color: #1976d2;
            box-shadow: 0 0 5px rgba(25,118,210,0.4);
            outline: none;
        }

        button {
            width: 95%;
            padding: 12px;
            background: #1976d2;
            color: white;
            border: none;
            font-size: 17px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            transition: 0.2s;
        }

        button:hover {
            background: #0d47a1;
        }

        .error-msg {
            margin-top: 20px;
            color: #b71c1c;
            font-size: 16px;
            background: #ffcdd2;
            padding: 10px;
            border-radius: 6px;
        }

    </style>
</head>
<body>

<div class="login-box">
    <h2>Iniciar Sesión</h2>

    <form method="POST">
        <input type="text" name="user" placeholder="Usuario" required>
        <input type="password" name="pass" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
    </form>

    <?php if (!empty($error)): ?>
        <div class="error-msg"><?= $error ?></div>
    <?php endif; ?>
</div>

</body>
</html>
