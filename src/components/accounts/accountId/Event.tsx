import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { InputMoney } from "./InputMoney";
import { toast } from "react-hot-toast";
import { calculatePortion, calculateSaving } from "~/utils/money";
import Payment from "./Payment";
import { EventContextProvider, useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import Spinner from "~/components/Spinner";

interface Props {
	eventId: string;
}

export default function Event({ eventId }: Props) {
	const { accountId } = useAccountContext();
	const { data: payments } = api.event.getPayments.useQuery({ accountId, eventId });
	const { data: event } = api.event.get.useQuery({ accountId, eventId });

	if (!event || !payments) {
		return (
			<Spinner />
		)
	}

	const saving = 0;
	const portion = calculatePortion(saving, payments, event.income);

	return (
		<EventContextProvider
			event={event}
			payments={payments}
			saving={saving}
			portion={portion}
		>
			<Details />
		</EventContextProvider>
	)
}
function Details() {

	const {
		event: { name, delivery, income },
		payments,
		saving,
		setSaving,
		portion,
		setPortion
	} = useEventContext();

	const [open, setOpen] = useState<boolean>(true);

	return (
		<li className="pb-4">
			<div className="border border-gray-200 rounded-lg">

				{/* event details */}
				<ul className="flex flex-col gap-2 p-2 rounded-t-inner">
					<li className="flex justify-between">
						<div className="">{name}</div>

						<div className="flex">
							<div>
								{delivery.toLocaleString("hu", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit"
								})}
							</div>
							<div className="w-6 h-6 flex items-center justify-end">
								{open ? <MdArrowDropUp /> : <MdArrowDropDown />}
							</div>
						</div>

					</li>

					<li className="flex justify-between">
						<div className="">Income</div>
						<div className="font-bold text-green-700">{income.toLocaleString("hu")}</div>
					</li>

					<li className="flex justify-between">
						<div className="">Saving</div>
						<div className="w-32">
							<InputMoney
								value={saving || null}
								onChange={(newSaving) => {
									const realSaving = newSaving ?? 0;
									const newPortion = calculatePortion(realSaving, payments, income);
									if (newPortion < 0) {
										toast.error("Saving is too high");
										return;
									}
									setPortion(newPortion);
									setSaving(realSaving);
								}}
							/>
						</div>
					</li>

					<li className="flex justify-between">
						<div className="">Portion</div>
						<div className="w-32">
							<InputMoney
								value={portion || null}
								onChange={(newPortion) => {
									const realPortion = newPortion ?? 0;
									const newSaving = calculateSaving(realPortion, payments, income);
									if (newSaving < 0) {
										toast.error("Partial is too high");
										return;
									}
									setSaving(newSaving);
									setPortion(realPortion);
								}}
							/>
						</div>
					</li>
				</ul>

				{/* payments */}
				<table className="w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2 font-normal text-left">Payee</th>
							<th className="p-2 font-normal text-right">Rata</th>
							<th className="p-2 font-normal text-right">Amount</th>
							<th className="p-2 font-normal text-right">Extra</th>
							<th className="p-2 font-normal text-right">Total</th>
						</tr>
					</thead>

					<tbody>
						{payments.map((payment) => (
							<Payment
								key={payment.id}
								paymentId={payment.id}
							/>
						))}
					</tbody>
				</table>
			</div>
		</li >
	)
}
