@echo off
REM This script calls the NPM script to upload an image to Bluesky

REM Change directory to the project root
cd /d "%~dp0"

REM Run the NPM script to upload the image
npm run imageUpload

REM Check if the command was successful
if %ERRORLEVEL% neq 0 (
    echo Failed to upload image.
    exit /b %ERRORLEVEL%
)
echo Image uploaded successfully.