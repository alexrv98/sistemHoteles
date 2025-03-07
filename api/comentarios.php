<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar el token del usuario
    $usuario = verificarToken();

    if (!isset($_GET['hotel_id'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Se requiere el parámetro hotel_id"
        ]);
        exit;
    }

    $hotel_id = intval($_GET['hotel_id']);

    try {
        // Obtener los comentarios para un hotel específico
        $stmt = $conn->prepare("SELECT r.id, r.comentario, r.calificacion, r.fecha, u.nombre AS usuario
                                FROM reseñas r
                                INNER JOIN usuarios u ON r.usuario_id = u.id
                                WHERE r.hotel_id = :hotel_id
                                ORDER BY r.fecha DESC");
        $stmt->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmt->execute();
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $comentarios
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener los comentarios: " . $e->getMessage()
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar el token del usuario
    $usuario = verificarToken();

    // Obtener los datos JSON enviados en la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar si los parámetros necesarios están presentes en los datos JSON
    if (!isset($data['hotel_id']) || !isset($data['calificacion']) || !isset($data['comentario'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Se requieren los parámetros hotel_id, calificacion y comentario"
        ]);
        exit;
    }

    $hotel_id = intval($data['hotel_id']);
    $calificacion = intval($data['calificacion']);
    $comentario = $data['comentario'];

    // Validar la calificación
    if ($calificacion < 1 || $calificacion > 5) {
        echo json_encode([
            "status" => "error",
            "message" => "La calificación debe estar entre 1 y 5"
        ]);
        exit;
    }

    try {
        // Insertar el nuevo comentario en la base de datos
        $stmt = $conn->prepare("INSERT INTO reseñas (usuario_id, hotel_id, calificacion, comentario)
                                VALUES (:usuario_id, :hotel_id, :calificacion, :comentario)");
        $stmt->bindParam(':usuario_id', $usuario['id'], PDO::PARAM_INT);
        $stmt->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmt->bindParam(':calificacion', $calificacion, PDO::PARAM_INT);
        $stmt->bindParam(':comentario', $comentario, PDO::PARAM_STR);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Comentario añadido exitosamente"
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al agregar el comentario: " . $e->getMessage()
        ]);
    }
}
?>
