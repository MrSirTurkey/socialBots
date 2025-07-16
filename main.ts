import { generateImage } from "./imageGeneration";
import { blueskyImageUpload } from "./bskyUpload";

async function main() {
    const { imageB64, hashtags } = await generateImage();

    if (!imageB64) {
        throw new Error("Image generation failed, no image data returned.");
    }

    await blueskyImageUpload(imageB64, hashtags);
}

main()
    .then(() => console.log("Image creation and upload successful"))
    .catch((error) => console.error("Error generating and uploading image:", error));