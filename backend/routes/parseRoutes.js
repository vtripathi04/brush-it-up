import express from 'express';
import multer from 'multer';
import { handlePdfUpload } from '../controllers/parseController.js'

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('file'), handlePdfUpload);

export default router;
