<?php
// Installer to add section column to products table
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
    // Check if section column exists
    $stmt = $pdo->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?');
    $stmt->execute([$dbName, 'products', 'section']);
    $exists = $stmt->fetch();
    
    if (!$exists) {
        // Add section column
        $sql = "ALTER TABLE products ADD COLUMN section VARCHAR(50) NULL DEFAULT NULL AFTER category";
        $pdo->exec($sql);
        echo "section column added to products table.\n";
    } else {
        echo "section column already exists in products table.\n";
    }
    
    echo "Products table is ready. You can now use section='offers' or section='featured' in your products.\n";
} catch (Exception $e) {
    http_response_code(500);
    echo "Failed to add section column: " . $e->getMessage() . "\n";
}
?>

