import { calculatePortion, calculateTotal } from "~/utils/money";
import { InputMoney } from "./InputMoney";
import { useEventContext } from "~/context/event";
import { toast } from "react-hot-toast";

interface Props {
  paymentId: string
}

export default function Payment({ paymentId }: Props) {
  const { event, payments, setPayments, saving, portion, setPortion } = useEventContext();
  const index = payments.findIndex((payment) => payment.id === paymentId);
  const payment = payments[index];

  if (!payment) {
    return null;
  }

  return (
    <tr key={payment.id}>
      <td className="p-2 text-left">{payment.payee.name}</td>
      <td className="flex gap-2 p-2 text-right">
        <div>x</div>
        <input
          className="w-12 border border-black rounded text-right"
          type="number"
          min={0}
          max={9007199254740991}
          step={1}
          required={true}
          value={payment.factor}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
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
      </td>
      <td className="p-2 text-right">{(payment.factor * portion).toLocaleString("hu", {
        maximumFractionDigits: 2
      })}</td>
      <td className="p-2 text-right">
        <InputMoney
          value={payment.extra}
          onChange={(newExtra) => {
            const realExtra = newExtra ?? 0;
            const newPayment = { ...payment, extra: realExtra };
            const newPayments = [...payments];
            newPayments[index] = newPayment;
            setPayments(newPayments);
            const newPortion = calculatePortion(saving, newPayments, event.income);
            setPortion(newPortion);
          }}
        />
      </td>
      <td className="p-2 text-right">
        {calculateTotal(portion, payment.factor, payment.extra).toLocaleString("hu", {
          maximumFractionDigits: 2
        })}
      </td>
    </tr>
  )
}
