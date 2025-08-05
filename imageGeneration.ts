import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

import {
    actions,
    atmospheres,
    characters,
    companionsOrProps,
    compositionStyles,
    descriptors,
    environmentalFeatures,
    materialDetails,
    renderTags,
    roles,
    scenicAtmospheres,
    scenicEnvironmentalFeatures,
    scenicSettings,
    settings,
    viewSubjects,
    viewTypes
} from "./utility/promptSections";

const client = new OpenAI();

function generateCharacterPrompt() {
    let prompt = "";

    // Section 1: Character/Subject
    const C = characters;
    // Randomly select a character from the list
    prompt += `${C[Math.floor(Math.random() * C.length)]}`;

    // Section 2: Descriptors (Optional)
    const D = descriptors;
    // Randomly select a descriptor from the list, 50% chance to include
    if (Math.random() < 0.6) {
        prompt += ` who is ${D[Math.floor(Math.random() * D.length)]}`;
    }

    // Section 3: Role/Identity (Optional)
    const R = roles;
    // Randomly select a role from the list, 50% chance to include
    if (Math.random() < 0.6) {
        prompt += ` acting as ${R[Math.floor(Math.random() * R.length)]}`;
    }

    // Section 4: Action/Activity
    const A = actions;
    prompt += `, engaged in ${A[Math.floor(Math.random() * A.length)]}`;

    // Section 5: Companions/Props (Optional)
    const P = companionsOrProps;
    // Randomly select a companion or prop from the list, 50% chance to include
    if (Math.random() < 0.6) {
        prompt += `, accompanied by ${P[Math.floor(Math.random() * P.length)]}`;
    }

    // Section 6: Setting/Location
    const S = settings;
    // Randomly select a setting from the list
    prompt += `, located in ${S[Math.floor(Math.random() * S.length)]}`;

    // Section 7: Environmental Features
    const E = environmentalFeatures;
    // Randomly select an environmental feature from the list
    prompt += `, surrounded by ${E[Math.floor(Math.random() * E.length)]}`;

    // Section 8: Atmosphere/Mood/Lighting
    const M = atmospheres;
    prompt += `, that is ${M[Math.floor(Math.random() * M.length)]}`;

    return prompt;
}

function generateScenicPrompt() {
    let prompt = "";

    // Section 1: View Type
    const VT = viewTypes;
    prompt += `${VT[Math.floor(Math.random() * VT.length)]}`;

    // Section 2: Primary Subject
    const PS = viewSubjects;
    prompt += ` of ${PS[Math.floor(Math.random() * PS.length)]}`;

    // Section 3: Composition Style
    const CS = compositionStyles;
    prompt += `, ${CS[Math.floor(Math.random() * CS.length)]}`;

    // Section 4: Material Detail
    const MD = materialDetails;
    prompt += ` ${MD[Math.floor(Math.random() * MD.length)]}`;

    // Section 5: Setting/Location
    const SL = scenicSettings;
    prompt += `, ${SL[Math.floor(Math.random() * SL.length)]}`;

    // Section 6: Environmental Features
    const EF = scenicEnvironmentalFeatures;
    prompt += `, ${EF[Math.floor(Math.random() * EF.length)]}`;

    // Section 7: Atmosphere
    const AT = scenicAtmospheres;
    prompt += `, ${AT[Math.floor(Math.random() * AT.length)]}`;

    // Section 8: Rendering Tags (Optional)
    const RT = renderTags;
    // Randomly select a render tag from the list, 50% chance to include
    if (Math.random() < 0.5) {
        prompt += ` — ${RT[Math.floor(Math.random() * RT.length)]}.`;
    } else {
        prompt += '.';
    }

    return prompt;
}

async function cleanPrompt(prompt: string) {
    // Get ChatGPT to revise the prompt
    return client.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
            {
                //TODO: Better system prompt, improved hashtag creation and separation
                role: "system",
                content: `You are a helpful assistant that improves the detail of desktop background image prompts. 
                    You will respond ONLY with an adjusted version of the prompt, perfect for Dall-E 3 image generation, as well as two ampersands (&&) followed by a short series of hashtags that describe the image in a concise way. 
                    Different hashtags should be space-separated, multi-word hashtags should be in camelCase. 
                    Do not include #ai, #image, #background, #aiBackground, #aiImage, or #aiArt in the hashtags.`
            },
            {
                role: "user",
                content: `Revise this prompt for a Dall-E 3 background image to be more clear with more detail: "${prompt}"`
            }
        ],
        max_completion_tokens: 150,
        temperature: 0.5
    }).then(response => {
        const message = response.choices[0]?.message;
        return message && message.content ? message.content.trim() : "";
    });
}

export async function generateImage() {

    const promptSections = await cleanPrompt(Math.random() < 0.3 ? generateCharacterPrompt() : generateScenicPrompt());

    if (!promptSections) {
        throw new Error("Failed to generate a valid prompt. Please try again.");
    }

    const [prompt, hashtags] = promptSections.split("&&").map(part => part.trim());
    console.log("Generated prompt:", prompt);
    console.log("Generated hashtags:", hashtags);

    //CASE: prompt is empty
    if (!prompt) {
        throw new Error("Generated prompt is empty. Please try again.");
    }

    const systemInstruction = "Create a visual image only. DO NOT modify this prompt. DO NOT add text, words, letters, typography, labels, signs, or writing of any kind in the image. Render exactly as described. The image should be purely visual with no readable text elements whatsoever: ";

    const img = await client.images.generate({
        model: "dall-e-3",
        prompt: systemInstruction + prompt,
        n: 1,
        size: "1792x1024",
        style: "vivid",
        response_format: "b64_json",
        quality: "hd"
    });

    if (!img.data || img.data.length === 0 || !img.data[0].b64_json) {
        throw new Error("No image data returned from OpenAI API");
    }

    return {imageB64: img.data[0].b64_json, hashtags: hashtags};
}