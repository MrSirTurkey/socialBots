import fs from 'fs';
import path from 'path';

export function saveB64Image(imageB64: string, filename?: string) {
    //CASE: No file location provided
    if(!process.env.FILE_LOCATION) {
        throw new Error("FILE_LOCATION environment variable is not set. Please set it to a valid directory path.");
    }

    //CASE: No image data provided
    if (!imageB64 || typeof imageB64 !== 'string') {
        throw new Error("Invalid image data provided. Ensure the image is a valid base64-encoded PNG.");
    }

    // Format directory path
    process.env.FILE_LOCATION = path.resolve(process.env.FILE_LOCATION);
    //CASE: Directory does not exist
    if (!fs.existsSync(process.env.FILE_LOCATION)) {
        fs.mkdirSync(process.env.FILE_LOCATION, { recursive: true });
    }

    //CASE: No filename provided, generate based on timestamp plus random string
    if(!filename) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        filename = `image_${timestamp}_${randomString}.png`;
    }

    // Format filename
    //Note: Currently only supports PNG format
    if (!filename.endsWith('.png')) {
        filename += '.png';
    }

    const buffer = Buffer.from(imageB64, 'base64');
    const filePath = path.join(process.env.FILE_LOCATION, filename);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error("Error saving image:", err);
        } else {
            console.log("Image saved successfully at", filePath);
        }
    });
}