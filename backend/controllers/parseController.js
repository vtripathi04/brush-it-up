import fs from "fs"
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const handlePdfUpload = async( req, res, next ) => {

    try {
        const pdfBuffer = fs.readFileSync( req.file.path );
        const data = await pdfParse( pdfBuffer );

        fs.unlinkSync( req.file.path )

        return successResponse( res, 'PDF parsed successfully', { text: data.text } );

    } catch (err) {
        next( err );
    }

}

