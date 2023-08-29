import { calculatePortion, calculateTotal } from "~/utils/money";
import { InputNumber } from "./InputNumber";
import { useEventContext } from "~/context/event";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";

interface Props {
  paymentId: string
}

export default function Payment({ paymentId }: Props) {
  const { event, payments, setPayments, saving, portion, setPortion, editing } = useEventContext();
  const { accountId } = useAccountContext();
  const { data: payees } = api.account.getPayees.useQuery({ accountId });
  const index = payments.findIndex((payment) => payment.id === paymentId);
  const payment = payments[index];

  if (!payment || !payees) {
    return null;
  }

  return (
    <>
      {/* name */}
      {editing ? (
        <select
          className="h-6 border border-gray-400 rounded bg-white"
          required={true}
          value={payment.payee.id}
          onChange={(e) => {
            const newPayeeId = e.target.value;
            const newPayee = payees.find((payee) => payee.id === newPayeeId);
            if (!newPayee) {
              toast.error("Invalid payee");
              return;
            }
            const newPayment = { ...payment, payee: newPayee };
            const newPayments = [...payments];
            newPayments[index] = newPayment;
            setPayments(newPayments);
          }}
        >
          {payees.map((payee) => (
            <option key={payee.id} value={payee.id}>
              {payee.name}
            </option>
          ))}
        </select>
      ) : (
        <div className="h-6">{payment.payee.name}</div>
      )}

      {/* factor */}
      {editing ? (
        <InputNumber
          value={payment.factor}
          onChange={(newFactor) => {
            const newPayment = { ...payment, factor: newFactor };
            const newPayments = [...payments];
            newPayments[index] = newPayment;
            setPayments(newPayments);
            const newPortion = calculatePortion(saving, newPayments, event.income);
            setPortion(newPortion);
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
              const realExtra = newExtra ?? 1;
              const newPayment = { ...payment, extra: realExtra };
              const newPayments = [...payments];
              newPayments[index] = newPayment;
              const newPortion = calculatePortion(saving, newPayments, event.income);
              // if (newPortion < 0) {
              //   toast.error("Extra is too high");
              //   return;
              // }
              setPayments(newPayments);
              setPortion(newPortion);
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
