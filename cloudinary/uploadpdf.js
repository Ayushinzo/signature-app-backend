import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import { getCloudinaryPublicId } from '../utils/getPublicId.js'

async function uploadPdf(pdfPath) {
    try {
        const pdfUrl = await cloudinary.uploader.upload(pdfPath, {
            folder: 'legelMark',
            resource_type: 'raw',
            public_id: `mydoc_${Date.now()}.pdf`
        })

        return {
            success: true,
            url: pdfUrl.secure_url
        }
    } catch (error) {
        return {
            success: true,
            message: error.message
        }
    }
}

async function destroyPdf(url) {
    try {
        let publicId = await getCloudinaryPublicId(url)
        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true })

        return {
            success: true,
            result
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export {
    uploadPdf,
    destroyPdf
}