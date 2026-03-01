<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$path = isset($data['path']) ? trim($data['path']) : '';

if (!$path) {
    http_response_code(400);
    echo json_encode(['error' => 'No file path provided']);
    exit();
}

if (!str_starts_with($path, '/')) {
    $path = '/' . $path;
}

$allowedFolders = ['description_image', 'staff_pic', 'uploads', 'profiles'];
$segments = explode('/', ltrim($path, '/'));
$folder = $segments[0] ?? '';

if (!in_array($folder, $allowedFolders, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Folder is not allowed']);
    exit();
}

$targetPath = realpath(__DIR__) . DIRECTORY_SEPARATOR . ltrim($path, '/');
$publicRoot = realpath(__DIR__);

if (!$publicRoot || !$targetPath) {
    echo json_encode(['success' => true, 'message' => 'File already missing']);
    exit();
}

if (strpos($targetPath, $publicRoot) !== 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file path']);
    exit();
}

if (file_exists($targetPath)) {
    if (@unlink($targetPath)) {
        echo json_encode(['success' => true]);
        exit();
    }

    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete file']);
    exit();
}

echo json_encode(['success' => true, 'message' => 'File already missing']);
