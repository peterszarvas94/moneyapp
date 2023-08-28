import { calculatePortion, calculateTotal } from "~/utils/money";
import { InputMoney } from "./InputMoney";
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
          className="border border-black rounded bg-white"
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
        <div>{payment.payee.name}</div>
      )}

      {/* factor */}
      {editing ? (
        <input
          className="border border-black rounded text-right"
          type="number"
          min={0}
          max={9007199254740991}
          step={1}
          required={true}
          value={payment.factor}
          onChange={(e) => {
            const newFactor = e.target.value;
            const realFactor = newFactor || "0";
            const newValue = parseInt(realFactor);
            if (isNaN(newValue)) {
              toast.error("Invalid number");
              return;
            }
            const newPayment = { ...payment, factor: newValue };
            const newPayments = [...payments];
            newPayments[index] = newPayment;
            setPayments(newPayments);
            const newPortion = calculatePortion(saving, newPayments, event.income);
            setPortion(newPortion);
          }}
        />
      ) : (
        <div className="text-right w-full">{payment.factor}</div>
      )}

      {/* amount */}
      <div className="text-right">
        {(payment.factor * portion).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </div>

      {/* extra */}
      <div className="text-right">
        {editing ? (
          <InputMoney
            value={payment.extra}
            onChange={(newExtra) => {
              const realExtra = newExtra ?? 1;
              const newPayment = { ...payment, extra: realExtra };
              const newPayments = [...payments];
              newPayments[index] = newPayment;
              const newPortion = calculatePortion(saving, newPayments, event.income);
              if (newPortion < 0) {
                toast.error("Extra is too high");
                return;
              }
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
      <div className="text-right">
        {calculateTotal(portion, payment.factor, payment.extra).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </div>
    </>
  )
}
