<?php
header('Content-Type: application/json; charset=utf-8');

// DB config — change to your DB user/password if different
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

$input = $_POST;
$fullname = trim($input['fullname'] ?? $input['username'] ?? '');
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$password2 = $input['password2'] ?? '';
$phone    = trim($input['phone'] ?? '');

if (!$fullname || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'fullname/username, email and password are required']);
    exit;
}

if ($password2 !== '' && $password !== $password2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Passwords do not match']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'invalid email']);
    exit;
}

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);

    // determine name column (fullname or username)
    $stmt = $pdo->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?');
    $stmt->execute([$dbName, 'users']);
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (in_array('fullname', $cols)) {
        $nameCol = 'fullname';
    } elseif (in_array('username', $cols)) {
        $nameCol = 'username';
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'users table must contain fullname or username column']);
        exit;
    }

    // check duplicate email
    $stmt = $pdo->prepare('SELECT COUNT(*) AS cnt FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $row = $stmt->fetch();
    if ($row && $row['cnt'] > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'email already registered']);
        exit;
    }

    // insert using detected column
    // WARNING: storing passwords in plain text is insecure.
    $plain = $password;
    
    // build insert columns (handle case where phone column may not exist)
    $colsToCheck = $cols;
    $hasPhone = in_array('phone', $colsToCheck);

    if ($hasPhone) {
        $sql = "INSERT INTO users ($nameCol, email, password, phone) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $email, $plain, $phone ?: null]);
    } else {
        $sql = "INSERT INTO users ($nameCol, email, password) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $email, $plain]);
    }

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Account created']);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    exit;
}
?>
