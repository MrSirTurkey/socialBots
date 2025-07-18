import { generateImage } from "./imageGeneration";
import { blueskyImageUpload } from "./bskyUpload";
import { saveB64Image } from "./utility/fileHelper";

async function main() {
    const { imageB64, hashtags } = await generateImage();

    if (!imageB64) {
        throw new Error("Image generation failed, no image data returned.");
    }

    // Optional: Check if local file saving is enabled
    if(process.env.SAVE_LOCAL_FILE && process.env.SAVE_LOCAL_FILE === 'true') {
        // Save a local copy of the image
        saveB64Image(imageB64);
    }

    // Upload the image to Bluesky
    await blueskyImageUpload(imageB64, hashtags);
}

main()
    .then(() => console.log("Image creation and upload successful"))
    .catch((error) => console.error("Error generating and uploading image:", error));