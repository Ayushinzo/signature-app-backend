import express from 'express'
import { body, validationResult } from 'express-validator'
import verifyToken from '../middleware/verifyToken.js'
import upload from '../multer/pdfUpload.js'
import { uploadPdf } from '../cloudinary/uploadpdf.js'
import Document from '../models/document.js'
import { uploadValidationRules } from '../validators/uploadpdf.js'
import { destroyPdf } from '../cloudinary/uploadpdf.js'
import fs from 'fs'

const documentRoute = express.Router()

import { PDFDocument, rgb } from 'pdf-lib'
import { url } from 'inspector'

//hex to rgb
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
}

// Helper: fetch PDF as ArrayBuffer
async function fetchPdfBytes(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

// Main: sign PDF
async function signPdfFromUrl(pdfUrl, signatureText, page, color, fontSize, fontFamily, coordinates) {
    // Fetch the PDF
    const pdfBytes = await fetchPdfBytes(pdfUrl);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the first page (or target specific page if needed)
    const pages = pdfDoc.getPages();
    const firstPage = pages[page];

    // Set position and style of the signature
    firstPage.drawText(signatureText, {
        x: coordinates.x, // adjust X as needed
        y: coordinates.y, // adjust Y as needed
        size: fontSize,
        color: hexToRgb(color)
    });

    // Save the modified PDF
    const signedPdfBytes = await pdfDoc.save();

    // Return as Blob for download or further processing
    return new Blob([signedPdfBytes], { type: 'application/pdf' });
}

documentRoute.post('/upload', verifyToken, upload.single('pdf'), uploadValidationRules, async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                success: false,
                message: "File is required"
            })
        }

        let errors = validationResult(req)

        if (!errors.isEmpty()) {
            fs.unlink(`public/${req.file?.filename}`, () => { })
            return res.json({
                success: false,
                message: errors.array()[0].msg
            })
        }

        const { name, page, coordinates, color, fontSize, fontFamily } = req.body;

        if (!name || !page || !coordinates || !color || !fontSize || !fontFamily) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }

        let result = await uploadPdf(`public/${req.file?.filename}`)

        fs.unlink(`public/${req.file?.filename}`, () => { })

        let blob = await signPdfFromUrl(result.url, name, parseInt(page) - 1, color, parseInt(fontSize), fontFamily, JSON.parse(coordinates))

        let destroy = await destroyPdf(result.url)

        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const base64Uri = `data:application/pdf;base64,${base64}`;

        let result1 = await uploadPdf(base64Uri)

        await Document.create({
            owner: req.user.id,
            url: result1.url
        })

        return res.json({
            success: true,
            url: result1.url
        })
    } catch (error) {
        fs.unlink(`public/${req.file?.filename}`, () => { })
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }
})

documentRoute.get('/getPdfFiles', verifyToken, async (req, res) => {
    try {
        let pdfFilers = await Document.find({ owner: req.user.id }).select('url').sort({ createdAt: -1 });

        if (!pdfFilers || pdfFilers.length === 0) {
            return res.json({
                success: false,
                message: "No PDF files found"
            })
        }

        return res.json({
            success: true,
            pdfFilers: pdfFilers
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }
})

documentRoute.delete('/delete', verifyToken, async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.json({
                success: false,
                message: "ID is required"
            })
        }

        let document = await Document.findById(id);

        if (!document) {
            return res.json({
                success: false,
                message: "Document not found"
            })
        }

        let destroy = await destroyPdf(document.url);

        if (!destroy) {
            return res.json({
                success: false,
                message: "Failed to delete document from cloud"
            })
        }

        await Document.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Document deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }
})

export default documentRoute;