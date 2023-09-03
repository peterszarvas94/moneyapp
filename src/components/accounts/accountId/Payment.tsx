import { calculatePortion, calculateTotal } from "~/utils/money";
import { InputNumber } from "./InputNumber";
import { useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import { PaymentDataType } from "~/utils/types";

interface Props {
  value: PaymentDataType;
  onChange: (payment: PaymentDataType) => void;
  portion: number;
}

export default function Payment({ value, onChange, portion }: Props) {
  const payment = value;

  const { event, payments, editing } = useEventContext();
  const { accountId } = useAccountContext();
  const { data: payees } = api.account.getPayees.useQuery({ accountId });

  if (!payees) {
    return null;
  }

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
          onChange={(newFactor) => {
            // const newPortion = calculatePortion(saving, newPayments, event.income);
            // setPortion(newPortion);
            onChange({ ...payment, factor: newFactor });
          }}
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
            onChange={(newExtra) => {
              onChange({ ...payment, extra: newExtra });

              // const realExtra = newExtra ?? 1;
              // const newPayment = { ...payment, extra: realExtra };
              // const newPayments = [...payments];
              // newPayments[index] = newPayment;
              // const newPortion = calculatePortion(saving, newPayments, event.income);
              // setPayments(newPayments);
              // setPortion(newPortion);
            }}
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
