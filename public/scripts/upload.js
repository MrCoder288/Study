document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const fileMsg = document.querySelector('.file-msg');
    const uploadIndicator = document.querySelector('.upload-indicator');

    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            fileMsg.textContent = `Selected file: ${fileName}`;
            uploadIndicator.style.visibility = 'hidden'; // Hide indicator until submission
        } else {
            fileMsg.textContent = 'Drag and drop your file here or click to upload';
        }
    });

    document.getElementById('uploadForm').onsubmit = function(event) {
        if (fileInput.files.length > 0) {
            uploadIndicator.textContent = 'Uploading...';
            uploadIndicator.style.visibility = 'visible';

            // Allow the form to submit and show the success message after a slight delay
            setTimeout(() => {
                uploadIndicator.textContent = 'File uploaded successfully!';
            }, 1000); // Adjust this delay as needed
        } else {
            event.preventDefault();
            alert('Please select a file to upload.');
        }
    };
});
