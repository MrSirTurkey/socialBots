# Social Bot Image Upload

## Overview
Social Bot Image Upload is a Node.js application that generates creative desktop background images using OpenAI's DALL-E 3 and uploads them to the Bluesky social platform. It features automated prompt generation for unique, detailed images and supports hashtag creation for social media posts.

## Features
- **Automated Image Generation:** Uses OpenAI's DALL-E 3 to create vivid, high-resolution images based on randomly generated prompts.
- **Prompt Enrichment:** Prompts are programmatically constructed and refined using GPT-4 for maximum creativity and detail.
- **Bluesky Upload:** Images are compressed if needed and uploaded directly to Bluesky with rich hashtags and metadata.
- **Local Image Saving:** Optionally saves a local copy of each generated image for archival or reuse.
- **Configurable via Environment Variables:** Credentials and file locations are managed securely using environment variables.

## Installation
1. **Clone the repository:**
   ```powershell
   git clone https://github.com/MrSirTurkey/socialBots.git
   cd socialBots
   ```
2. **Install dependencies:**
   ```powershell
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the project root with the following keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   BSKY_USERNAME=your_bluesky_username
   BSKY_PASSWORD=your_bluesky_password
   SAVE_LOCAL_FILE='true' #optional, to save images locally
   FILE_LOCATION=absolute_path_to_save_images
   ```

## Usage
- **Generate and upload an image:**
  ```powershell
  npm run imageUpload
  ```
- **Automate via batch script:**
  Run `automateImageUpload.bat` to execute the upload process from Windows Explorer or Task Scheduler.

## Project Structure
- `main.ts` — Entry point; orchestrates image generation, saving, and upload.
- `imageGeneration.ts` — Handles prompt creation and DALL-E 3 API calls.
- `bskyUpload.ts` — Manages Bluesky authentication, image compression, and posting.
- `utility/fileHelper.ts` — Saves base64 images to disk.
- `utility/promptSections.ts` — Contains prompt-building word lists.
- `automateImageUpload.bat` — Windows batch script for automation.

## Dependencies
- [openai](https://www.npmjs.com/package/openai)
- [@atproto/api](https://www.npmjs.com/package/@atproto/api)
- [sharp](https://www.npmjs.com/package/sharp)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Author
Matthew Steckel

## License
MIT

## Notes
- Ensure your OpenAI and Bluesky credentials are valid and kept secure.
- The application is designed for desktop background image generation and social sharing; avoid using for commercial image generation without proper licensing.
- For troubleshooting, check console output and ensure all environment variables are set.
