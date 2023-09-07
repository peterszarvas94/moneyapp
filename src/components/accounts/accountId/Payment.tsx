import { calculateTotal } from "~/utils/money";
import { InputNumber } from "./InputNumber";
import type { PaymentDataType, NewPaymentDataType } from "~/utils/types";
import type { Payee } from "~/server/db/schema";
import { AiFillDelete } from "react-icons/ai";

interface Props {
  value: PaymentDataType | NewPaymentDataType;
  onChange: (payment: PaymentDataType | NewPaymentDataType) => void;
  onDelete: () => void;
  portion: number;
  editing: boolean;
  payees: Payee[];
}

export default function Payment({ value, onChange, onDelete, portion, editing, payees }: Props) {
  const payment = value;

  return (
    <>
      {/* name */}
      {editing ? (
        <div className="flex gap-1">
          {/* delete */}
          {editing && (
            <button
              className="text-xl text-red-500"
              onClick={() => onDelete()}
            >
              <AiFillDelete />
            </button>
          )}
          <select
            className="h-6 border border-gray-400 rounded bg-white grow"
            required={true}
            defaultValue={payment.payeeId}
            onChange={(e) =>
              onChange({
                ...payment,
                payeeId: e.target.value
              })
            }
          >
            {payees.map((payee) => (
              <option key={payee.id} value={payee.id}>
                {payee.name}
              </option>
            ))}
          </select>
        </div>
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
        {((payment.factor ?? 0) * portion).toLocaleString("hu", {
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
            {payment.extra?.toLocaleString("hu", {
              maximumFractionDigits: 2
            }) ?? 0}
          </>
        )}
      </div>

      {/* total */}
      <div className="h-6 text-right">
        {calculateTotal(portion, payment.factor ?? 0, payment.extra ?? 0).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </div>
    </>
  )
}
