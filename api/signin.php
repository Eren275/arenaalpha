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

// Read input (supports JSON or form-encoded)
$input = [];
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?? [];
} else {
    $input = $_POST;
}

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    
    // Check which columns exist in the users table
    $stmt = $pdo->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?');
    $stmt->execute([$dbName, 'users']);
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Determine name column (fullname or username)
    if (in_array('fullname', $cols)) {
        $nameCol = 'fullname';
    } elseif (in_array('username', $cols)) {
        $nameCol = 'username';
    } else {
        $nameCol = 'fullname'; // default fallback
    }
    
    // Check if password_hash column exists (for hashed passwords) or password (for plain text)
    $hasPasswordHash = in_array('password_hash', $cols);
    $hasPassword = in_array('password', $cols);
    
    if ($hasPasswordHash) {
        // Use password_hash column with password_verify
        $stmt = $pdo->prepare("SELECT id, $nameCol, email, password_hash FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
            exit;
        }
    } elseif ($hasPassword) {
        // Use password column with plain text comparison (matching signup.php behavior)
        $stmt = $pdo->prepare("SELECT id, $nameCol, email, password FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || $user['password'] !== $password) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database configuration error: password column not found']);
        exit;
    }

    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user[$nameCol];
    $_SESSION['user_email'] = $user['email'];

    echo json_encode([
        'success' => true,
        'message' => 'Signed in successfully',
        'user' => [
            'id' => $user['id'],
            'fullname' => $user[$nameCol],
            'email' => $user['email']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>
