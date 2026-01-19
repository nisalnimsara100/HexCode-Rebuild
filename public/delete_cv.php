<?php
// delete_cv.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$filename = $data['filename'] ?? '';

if (!$filename) {
    echo json_encode(['error' => 'No filename provided']);
    exit();
}

// Security: Prevent directory traversal
$filename = basename($filename);
$targetPath = __DIR__ . '/cvs/' . $filename;

if (file_exists($targetPath)) {
    if (unlink($targetPath)) {
        echo json_encode(['success' => true]);
    } else {
         http_response_code(500);
        echo json_encode(['error' => 'Failed to delete file']);
    }
} else {
    // If file doesn't exist, we can consider it "deleted" or return 404.
    // Let's return success to not break the frontend flow.
    echo json_encode(['success' => true, 'message' => 'File not found, assumed deleted']);
}
?>
