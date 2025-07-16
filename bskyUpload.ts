import { Agent, CredentialSession } from '@atproto/api';
import dotenv from "dotenv";
dotenv.config();

export async function blueskyImageUpload() {
    const session = new CredentialSession(new URL("https://bsky.app/profile/neuralbackgrounds.bsky.social"));

    const agent = new Agent(session);

    //agent.app.bsky.feed.post.create()
}