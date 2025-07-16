import { generateImage } from "./imageGeneration";

async function main() {
    const imageB64 = await generateImage();
}

main()
    .then(() => console.log("Image creation and upload successful"))
    .catch((error) => console.error("Error generating and uploading image:", error));