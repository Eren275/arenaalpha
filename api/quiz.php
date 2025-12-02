<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$dbHost = '127.0.0.1';
$dbName = 'arena_alpha';
$dbUser = 'eren';
$dbPass = 'at6771419';
$charset = 'utf8mb4';

$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$often = trim($_POST['often'] ?? '');
$platform = trim($_POST['platform'] ?? '');
$payment = trim($_POST['payment'] ?? '');
$interests = $_POST['interests'] ?? '[]';

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS quiz (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            often VARCHAR(20) NULL,
            platform VARCHAR(191) NULL,
            payment VARCHAR(191) NULL,
            interests_json TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX ix_quiz_user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC"
    );

    $userId = !empty($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

    $stmt = $pdo->prepare('INSERT INTO quiz (user_id, often, platform, payment, interests_json) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $often ?: null, $platform ?: null, $payment ?: null, $interests ?: '[]']);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
