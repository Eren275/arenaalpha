<?php

$host = 'localhost';
$dbName = 'arena_alpha';
$dbUser = 'eren';
$dbPass = 'at6771419';

try {
    $conn = new mysqli($host, $db_user, $db_pass, $db_name);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
} catch (Exception $e) {
    die("Database connection error: " . $e->getMessage());
}
?>