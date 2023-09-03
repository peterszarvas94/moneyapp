import { PaymentDataType, NewPaymentDataType } from "./types";

export function calculateTotal(portion: number, factor: number, extra: number) {
  return portion * factor + extra;
}

export function calculatePortion(
  saving: number,
  payments: PaymentDataType[],
  newPayments: NewPaymentDataType[],
  income: number
) {
  const stripped_payments = payments.map((payment) => ({
    factor: payment.factor,
    extra: payment.extra,
  }));

  const stripped_newPayments = newPayments.map((payment) => ({
    factor: payment.factor,
    extra: payment.extra,
  }));

  const all_payments = stripped_payments.concat(stripped_newPayments);

  const factor_sum = all_payments.reduce((acc, payment) => payment.factor + acc, 0) || 1;
  const extra_sum = all_payments.reduce((acc, payment) => payment.extra + acc, 0);
  const expense_sum = extra_sum + saving;
  const remaining = income - expense_sum;
  const partial = remaining / factor_sum;
  // round to 2 decimal places
  return Math.floor(partial * 100) / 100;
}

export function calculateSaving(
  portion: number,
  payments: PaymentDataType[],
  newPayments: NewPaymentDataType[],
  income: number
) {
  const stripped_payments = payments.map((payment) => ({
    factor: payment.factor,
    extra: payment.extra,
  }));

  const stripped_newPayments = newPayments.map((payment) => ({
    factor: payment.factor,
    extra: payment.extra,
  }));

  const all_payments = stripped_payments.concat(stripped_newPayments);

  const total_sum = all_payments.reduce((acc, payments) => calculateTotal(
    portion, payments.factor, payments.extra
  ) + acc, 0);
  const saving = income - total_sum;
  // round to 2 decimal places
  return Math.floor(saving * 100) / 100;
}
