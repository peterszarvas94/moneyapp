import type { WebhookEvent } from "@clerk/nextjs/dist/types/server";
import { NextApiRequest, NextApiResponse } from "next";
import { vanillaApi } from "~/utils/api";

// TODO: this needs to be verified with Svix
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body as WebhookEvent;
  if (event.type === "user.created") {
    const { first_name, last_name, email_addresses, primary_email_address_id, id: clerkId } = event.data;
    const name = `${first_name} ${last_name}`;
    const primary = email_addresses.find((e) => e.id === primary_email_address_id);

    if (!primary) {
      return res.status(500);
    }

    const { email_address: email } = primary;

    try {
      await vanillaApi.user.new.mutate({
        name,
        email,
        clerkId,
      });
    } catch (error) {
      return res.status(500);
    }

    return res.status(200).json({ success: true, message: "User created" });
  }

  if (event.type === "user.updated") {
    const { first_name, last_name, email_addresses, primary_email_address_id, id: clerkId } = event.data;
    const name = `${first_name} ${last_name}`;
    const primary = email_addresses.find((e) => e.id === primary_email_address_id);

    if (!primary) {
      return res.status(500);
    }

    const { email_address: email } = primary;

    try {
      await vanillaApi.user.update.mutate({
        name,
        email,
        clerkId,
      });
    } catch (error) {
      return res.status(500);
    }

    return res.status(200).json({ success: true, message: "User updated" });
  }

  if (event.type === "user.deleted") {
    const { id: clerkId } = event.data;

    if (!clerkId) {
      return res.status(500);
    }

    try {
      await vanillaApi.user.delete.mutate({
        clerkId,
      });
    } catch (error) {
      return res.status(500);
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  }

  res.status(200);
};
