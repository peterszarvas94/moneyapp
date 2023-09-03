import { Account, Membership, Payee, Payment, User } from "~/server/db/schema";

export type Access = "admin" | "viewer";

export type Member = Membership & {
  user: User
}

export type Page = "home" | "dashboard" | "account" | "new-account" | "edit-account" | "member" | "new-member" | "edit-member" | "new-payee" | "payee" | "edit-payee" | "new-event" | "event" | "edit-event" | "new-payment" | "payment" | "edit-payment";

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

export type PaymentWithPayee = Payment & {
  payee: Payee,
}

export type EventDataType = {
  name: string;
  delivery: string;
  income: number;
  saving: number;
  portion: number;
  payments: PaymentDataType[];
  newPayments: NewPaymentDataType[];
}

export type PaymentDataType = {
  paymentId: string;
  payeeId: string;
  factor: number;
  extra: number;
}

export type NewPaymentDataType = {
  payeeId: string;
  factor: number;
  extra: number;
}
