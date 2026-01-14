<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Define allowed file types
$allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
];

// Define max file size (5MB)
$maxSize = 5 * 1024 * 1024;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if file was uploaded
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error.']);
        exit();
    }

    $file = $_FILES['file'];
    $folder = isset($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder']) : 'uploads';
    
    // Validate file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Allowed: PDF, Word, JPEG, PNG, WEBP.']);
        exit();
    }

    // Validate size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Max size is 5MB.']);
        exit();
    }

    // Create target directory
    $targetDir = __DIR__ . '/' . $folder;
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Sanitize filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $targetPath = $targetDir . '/' . $filename;

    // Move file
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        // Handle subdirectory if script is not in root
        $uri = dirname($_SERVER['REQUEST_URI']);
        if ($uri === '/' || $uri === '\\') $uri = '';
        
        $publicUrl = "/{$folder}/{$filename}";
        
        echo json_encode([
            'success' => true,
            'path' => $publicUrl,
            'url' => $publicUrl 
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save file. Check server permissions.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
}
?>
