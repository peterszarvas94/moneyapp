import { calculateTotal } from "~/utils/money";
import { InputNumber } from "./InputNumber";
import type { PaymentDataType, NewPaymentDataType } from "~/utils/types";
import type { Payee } from "~/server/db/schema";

interface Props {
  value: PaymentDataType | NewPaymentDataType;
  onChange: (payment: PaymentDataType | NewPaymentDataType) => void;
  portion: number;
  editing: boolean;
  payees: Payee[];
}

export default function Payment({ value, onChange, portion, editing, payees }: Props) {
  const payment = value;

  return (
    <>
      {/* name */}
      {editing ? (
        <select
          className="h-6 border border-gray-400 rounded bg-white"
          required={true}
          defaultValue={payment.payeeId}
        >
          {payees.map((payee) => (
            <option key={payee.id} value={payee.id}>
              {payee.name}
            </option>
          ))}
        </select>
      ) : (
        <div className="h-6">{payees.find((payee) => payee.id === payment.payeeId)?.name}</div>
      )}

      {/* factor */}
      {editing ? (
        <InputNumber
          value={payment.factor}
          onChange={(newFactor) => onChange({ ...payment, factor: newFactor })}
        />
      ) : (
        <div className="h-6 text-right">{payment.factor}</div>
      )}

      {/* amount */}
      <div className="h-6 text-right hidden sm:block">
        {(payment.factor * portion).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </div>

      {/* extra */}
      <div className="h-6 text-right">
        {editing ? (

          <InputNumber
            value={payment.extra}
            onChange={(newExtra) => onChange({ ...payment, extra: newExtra })}
          />
        ) : (
          <>
            {payment.extra.toLocaleString("hu", {
              maximumFractionDigits: 2
            })}
          </>
        )}
      </div>

      {/* total */}
      <div className="h-6 text-right">
        {calculateTotal(portion, payment.factor, payment.extra).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </div>
    </>
  )
}
