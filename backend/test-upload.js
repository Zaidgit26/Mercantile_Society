const fs = require('fs');
const path = require('path');

function testUploadDirectory() {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
        console.log('Creating uploads directory...');
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Test write permissions
    const testFile = path.join(uploadsDir, 'test.txt');
    try {
        fs.writeFileSync(testFile, 'Test content');
        console.log('Successfully wrote test file');
        
        // Clean up
        fs.unlinkSync(testFile);
        console.log('Successfully cleaned up test file');
        
        console.log('Upload directory is properly configured at:', uploadsDir);
    } catch (err) {
        console.error('Error testing upload directory:', err);
    }
}

testUploadDirectory(); 