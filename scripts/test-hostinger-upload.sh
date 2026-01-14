#!/bin/bash

# Usage: ./scripts/test-hostinger-upload.sh https://yourdomain.com

if [ -z "$1" ]; then
    echo "Usage: $0 <your-website-url>"
    echo "Example: $0 https://my-site.com"
    exit 1
fi

DOMAIN=$1
UPLOAD_URL="${DOMAIN}/upload.php"

echo "🧪 Testing upload to: $UPLOAD_URL"

# Create a dummy test file (Fake PDF to pass MIME check)
echo "%PDF-1.5" > test_upload.pdf
echo "Dummy PDF content for testing" >> test_upload.pdf

# Perform the upload using curl
RESPONSE=$(curl -s -F "file=@test_upload.pdf" -F "folder=tests" "$UPLOAD_URL")

# Clean up
rm test_upload.pdf

echo "📄 Response from server:"
echo "$RESPONSE"

# Check if success
if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Upload Test Passed!"
    echo "Your Hostinger PHP upload script is working correctly."
else
    echo "❌ Upload Test Failed."
    echo "Check if:"
    echo "1. The site is deployed."
    echo "2. upload.php exists in public_html."
    echo "3. The uploads/ folder is writable."
fi
