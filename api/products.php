<?php
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

// Get category filter from query parameter
$category = $_GET['category'] ?? null;
$section = $_GET['section'] ?? null; // For index.html sections (offers, featured)

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    
    // Check if section column exists
    $stmt = $pdo->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?');
    $stmt->execute([$dbName, 'products', 'section']);
    $hasSection = $stmt->fetch() !== false;
    
    // Your table structure: id, name, category, description, price, original_price, image, stock, created_at
    // Map original_price to old_price and image to picture for compatibility with frontend
    $selectCols = 'id, name, category, description, price, original_price AS old_price, image AS picture, stock';
    if ($hasSection) {
        $selectCols .= ', section';
    }
    
    $sql = "SELECT $selectCols FROM products WHERE 1=1";
    $params = [];
    
    if ($category) {
        $sql .= ' AND category = ?';
        $params[] = $category;
    }
    
    if ($section && $hasSection) {
        $sql .= ' AND section = ?';
        $params[] = $section;
    }
    
    $sql .= ' ORDER BY id ASC';
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'products' => $products]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

?>
