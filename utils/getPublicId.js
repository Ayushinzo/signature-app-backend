function getCloudinaryPublicId(url) {
    try {
        // Example URL: https://res.cloudinary.com/demo/raw/upload/v1710000000/legelMark/myfile.pdf

        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) {
            throw new Error('Invalid Cloudinary URL: no /upload/ found');
        }

        // Get the part after /upload/
        const afterUpload = url.substring(uploadIndex + 8); // skip "/upload/"

        // Remove version if present (starts with v and digits)
        const parts = afterUpload.split('/');
        if (parts[0].startsWith('v') && !isNaN(parts[0].substring(1))) {
            parts.shift(); // remove version part
        }

        // Join remaining parts
        let publicIdWithExt = parts.join('/');

        // Remove file extension
        const dotIndex = publicIdWithExt.lastIndexOf('.');
        if (dotIndex !== -1) {
            publicIdWithExt = publicIdWithExt.substring(0, dotIndex);
        }

        return publicIdWithExt + '.pdf';
    } catch (e) {
        console.error('Error extracting public_id:', e.message);
        return null;
    }
}

export {
    getCloudinaryPublicId
}