import type { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { vanillaApi } from "~/utils/api";

// TODO: this needs to be verified with Svix
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body as WebhookEvent;

  console.log('WEBHOOK', event);

  if (event.type === "user.deleted") {
    const { id: clerkId } = event.data;

    if (!clerkId) {
      res.status(500).json({ success: false });
    } else {
      try {
        await vanillaApi.user.delete.mutate({ clerkId });
        res.status(200).json({ success: true });
      } catch (error) {
        console.log('WEBHOOK ERROR', error);
        res.status(500).json({ success: false });
      }
    }
  } else {
    res.status(500).json({ success: false });
  }
}
