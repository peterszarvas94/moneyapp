import type { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { vanillaApi } from "~/utils/api";

// TODO: this needs to be verified with Svix
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body as WebhookEvent;

  console.log('WEBHOOK', event);

  if (event.type === "user.updated") {
    const { first_name, last_name, email_addresses, primary_email_address_id, id: clerkId } = event.data;
    const name = `${first_name} ${last_name}`;
    const primary = email_addresses.find((e) => e.id === primary_email_address_id);

    if (!primary) {
      res.status(500).json({ success: false });
    } else {
      const { email_address: email } = primary!;
      try {
        await vanillaApi.user.update.mutate({
          clerkId,
          name,
          email,
        });
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
