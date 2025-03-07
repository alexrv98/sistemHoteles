<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuario = verificarToken(); 

    try {
        $stmt = $conn->prepare("SELECT id, nombre, descripcion, ubicacion, imagen FROM lugares_turisticos");
        $stmt->execute();
        $lugares = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $lugares
                ]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener los lugares turísticos: " . $e->getMessage()
        ]);
    }
}
?>