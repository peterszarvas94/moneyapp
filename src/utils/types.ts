import { Account, Membership, Payee, User } from "~/server/db/schema";

export type Access = "admin" | "viewer";

export type Member = Membership & {
  user: User
}

export type Page = "home" | "dashboard" | "accounts" | "account" | "new-account" | "edit-account" | "member" | "new-member" | "edit-member";

export type PayeeWithMember = {
  payee: Payee,
  member: Member | null,
}

export type AccessWithAccount = {
  account: Account,
  access: Access,
}

export type DropDownItem = {
  id: string,
  url: string,
  text: string,
  newItem?: boolean,
  selected?: boolean,
}
