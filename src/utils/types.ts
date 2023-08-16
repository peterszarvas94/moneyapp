import { Membership, Payee, User } from "~/server/db/schema";

export type Access = "admin" | "viewer";

export type Member = Membership & {
  user: User
}

export type Page = "home" | "dashboard" | "accounts";

export type PayeeWithMember = {
  payee: Payee,
  member: Member | null,
}
