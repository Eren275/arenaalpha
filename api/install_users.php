<?php
// Simple installer to create `users` table used by signup/signin endpoints.
// Edit DB credentials below if needed.
$dbHost = '127.0.0.1';
$dbName = 'arena_alpha';
$dbUser = 'eren';
$dbPass = 'at6771419';
$charset = 'utf8mb4';

header('Content-Type: text/plain; charset=utf-8');

$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (Exception $e) {
    http_response_code(500);
    echo "DB connection failed: " . $e->getMessage() . "\n";
    exit;
}

try {
        // Use VARCHAR(191) for indexed UTF8MB4 columns to avoid key-length errors on older MySQL/InnoDB
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(191) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY ux_users_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC";

    $pdo->exec($sql);
    echo "users table created (or already exists).\n";
    echo "You can now POST to api/signup.php and api/signin.php.\n";
} catch (Exception $e) {
    http_response_code(500);
    echo "Failed to create table: " . $e->getMessage() . "\n";
}

?>
