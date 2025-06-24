import { execFile } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs/promises'; // We need the file system module now
import crypto from 'crypto'; // To generate unique filenames
import { fileURLToPath } from 'url';
import { successResponse } from '../utils/apiResponse.js';

// Setup for paths and the executable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ytDlpPath = path.join(__dirname, '..', 'yt-dlp.exe');
const execFilePromise = util.promisify(execFile);

const parseVtt = (vttString) => {
  return vttString
    .split('\n')
    .filter(line => !line.startsWith('WEBVTT') && !line.startsWith('Kind:') && !line.startsWith('Language:') && !line.includes('-->') && line.trim() !== '')
    .join(' ')
    .replace(/<[^>]*>/g, '');
};

export const handleYoutubeTranscript = async (req, res, next) => {
  // Generate a unique path for the temporary subtitle file
  const tempId = crypto.randomUUID();
  // We place the temp file inside the same directory to avoid permission issues
  const tempOutputPath = path.join(__dirname, `${tempId}.%(ext)s`);

  try {
    const { url, lang = 'en' } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const args = [
      url,
      '--write-auto-sub',
      '--sub-lang', lang,
      '--skip-download',
      '--sub-format', 'vtt',
      // CRITICAL CHANGE: Output to our unique temporary file path
      '-o', tempOutputPath
    ];

    console.log(`Executing yt-dlp, will write to: ${tempId}`);
    
    // Execute the command
    await execFilePromise(ytDlpPath, args);

    // Find the actual file that was created (e.g., tempId.en.vtt)
    const createdFileName = `${tempId}.${lang}.vtt`;
    const finalFilePath = path.join(__dirname, createdFileName);
    
    // Read the content of the file that yt-dlp created
    const vttContent = await fs.readFile(finalFilePath, 'utf-8');
    
    // Clean up the file immediately after reading
    await fs.unlink(finalFilePath);

    const text = parseVtt(vttContent);
    return successResponse(res, "YouTube transcript fetched successfully", { text });

  } catch (err) {
    console.error('Fatal error executing yt-dlp or processing file:', err);
    next(new Error(`Failed to process YouTube URL: ${err.message}`));
  }
};