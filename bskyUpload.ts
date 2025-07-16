import { BskyAgent } from '@atproto/api';
import sharp from 'sharp';
import dotenv from "dotenv";
dotenv.config();

const MAX_SIZE = 1000000; // 976.56KB in bytes

export async function blueskyImageUpload(imageB64: string, hashtags?: string) {
    const agent = new BskyAgent({
        service: 'https://bsky.social',
    });

    if (!process.env.BSKY_USERNAME || !process.env.BSKY_PASSWORD) {
        throw new Error("BSKY_USERNAME and BSKY_PASSWORD must be set in environment variables");
    }

    await agent.login({ identifier: process.env.BSKY_USERNAME, password: process.env.BSKY_PASSWORD });

    // Convert base64 to Buffer
    let imageBuffer = Buffer.from(imageB64, 'base64');

    // Compress if too large
    if (imageBuffer.length > MAX_SIZE) {
        // Try reducing quality until under limit
        let quality = 90;
        let compressed = await sharp(imageBuffer)
            .png({ quality })
            .toBuffer();

        while (compressed.length > MAX_SIZE && quality > 10) {
            quality -= 10;
            compressed = await sharp(imageBuffer)
                .png({ quality })
                .toBuffer();
        }
        imageBuffer = compressed;
    }

    // Upload image
    const uploadRes = await agent.uploadBlob(imageBuffer, {
        encoding: 'image/png',
    });

    // Ensure hashtags are formatted correctly
    if (hashtags) {
        hashtags = hashtags.replace(/#/g, '').trim().split(/\s+/).map(tag => `#${tag}`).join(' ');
    }

    const text = "#ai #image #background #aiBackground #aiImage " + (hashtags ? hashtags : "");
    const hashtagRegex = /#\w+/g;
    const facets: Array<{
        index: { byteStart: number; byteEnd: number };
        features: Array<{
            $type: string;
            tag: string;
        }>;
    }> = [];

    let match: RegExpExecArray | null;
    while ((match = hashtagRegex.exec(text)) !== null) {
        facets.push({
            index: {
                byteStart: match.index,
                byteEnd: match.index + match[0].length
            },
            features: [{
                $type: 'app.bsky.richtext.facet#tag',
                tag: match[0].split('#')[1]
            }]
        });
    }

    await agent.post({
        text: text,
        embed: {
            $type: 'app.bsky.embed.images',
            images: [{
                image: uploadRes.data.blob,
                alt: hashtags || "Generated image"
            }]
        },
        facets,
        createdAt: new Date().toISOString(),
    })
}