document.getElementById('uploadForm').onsubmit = function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        alert('File uploaded successfully!');
    }
};
