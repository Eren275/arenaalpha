<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
$user = null;
if (!empty($_SESSION['user_id'])) {
    $user = [
        'id' => $_SESSION['user_id'],
        'fullname' => $_SESSION['user_name'] ?? null,
    ];
}
echo json_encode(['success' => true, 'user' => $user]);
?>
