import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { InputNumber } from "./InputNumber";
import { toast } from "react-hot-toast";
import { calculatePortion, calculateSaving } from "~/utils/money";
import Payment from "./Payment";
import { EventContextProvider, useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import Spinner from "~/components/Spinner";
import { AiFillEdit, AiFillSave, AiOutlineUndo } from "react-icons/ai";

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

	const { accountId, access } = useAccountContext();
	const isAdmin = access === "admin";
	const { mutateAsync: updateEvent } = api.event.update.useMutation();
	const { mutateAsync: updatePayment } = api.payment.update.useMutation();

	const {
		event,
		setEvent,

		initialEvent,
		setInitialEvent,

		payments,
		setPayments,

		initialPayments,
		setInitialPayments,

		saving,
		setSaving,

		initialSaving,
		setInitialSaving,

		portion,
		setPortion,

		initialPortion,
		setInitialPortion,

		open,
		setOpen,

		editing,
		setEditing

	} = useEventContext();

	const { id, name, delivery, income } = event;

	return (
		<li className="pb-4">
			<div className="border border-gray-200 rounded-lg">

				{/* event details */}
				<ul className="flex flex-col gap-2 pb-2">

					{/* name */}
					<li className="flex justify-between bg-gray-200 rounded-t-inner p-2">
						{editing ? (
							<input
								className="w-32 h-6 border border-gray-400 rounded px-2"
								value={name}
								onChange={(e) => {
									const newName = e.target.value;
									const newEvent = { ...event, name: newName };
									setEvent(newEvent);
								}}
							/>
						) : (
							<div className="h-6">{name}</div>
						)}

						{/* buttons */}
						<div className="flex gap-2">

							{/* edit button */}
							{isAdmin && !editing && (
								<button
									onClick={async () => {
										setEditing(true);
									}}
								>
									<AiFillEdit />
								</button>
							)}

							{/* save button */}
							{isAdmin && editing && (
								<>
									<button
										onClick={async () => {
											try {
												await updateEvent({ accountId, name, income, saving, delivery, eventId: id });
											} catch (error) {
												toast.error("Failed to update event");
											}

											for (const payment of payments) {
												try {
													await updatePayment({
														accountId,
														extra: payment.extra,
														factor: payment.factor,
														paymentId: payment.id,
														payeeId: payment.payee.id
													});
												} catch (error) {
													toast.error("Failed to update payment");
													return;
												}
											}
											setInitialEvent(event);
											setInitialPayments(payments);
											setInitialSaving(saving);
											setInitialPortion(portion);
											setEditing(false);
										}}
									>
										<AiFillSave />
									</button>

									{/* undo button */}
									<button
										onClick={() => {
											setEvent(initialEvent);
											setPayments(initialPayments);
											setSaving(initialSaving);
											setPortion(initialPortion);
											setEditing(false);
										}}
									>
										<AiOutlineUndo />
									</button>
								</>
							)}

							{/* open/close button */}
							<button
								onClick={() => setOpen(!open)}
							>
								{open ? <MdArrowDropUp /> : <MdArrowDropDown />}
							</button>
						</div>
					</li>

					{/* delivery */}
					<li className="flex justify-between px-2">
						<div className="h-6">Delivery (mm/dd/yyyy)</div>
						{editing ? (
							<input
								className="w-32 h-6 border border-gray-400 rounded text-right"
								type="date"
								value={delivery.toISOString().slice(0, 10)}
								onChange={(e) => {
									const newDelivery = new Date(e.target.value);
									const newEvent = { ...event, delivery: newDelivery };
									setEvent(newEvent);
								}}
							/>
						) : (
							<div>{delivery.toLocaleString("en", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit"
							})}</div>
						)}
					</li>

					{/* income */}
					<li className="flex justify-between px-2">
						<div className="">Income</div>
						{editing ? (
							<InputNumber
								width="w-32"
								value={income}
								onChange={(newIncome) => {
									const newPortion = calculatePortion(saving, payments, newIncome);
									// if (newPortion < 0) {
									// 	toast.error("Income is too low");
									// }
									setPortion(newPortion);
									const newEvent = { ...event, income: newIncome };
									setEvent(newEvent);
								}}
							/>
						) : (
							<div className="w-32 h-6 text-right">
								{income.toLocaleString("hu")}
							</div>
						)}
					</li>

					{/* open saving & portion */}
					{open && (
						<>
							{/* saving */}
							<li className="flex justify-between px-2">
								<div className="">Saving</div>
								{editing ? (
									<InputNumber
										width="w-32"
										value={saving}
										invalid={saving < 0}
										onChange={(newSaving) => {
											const newPortion = calculatePortion(newSaving, payments, income);
											console.log(newPortion);
											// if (newPortion < 0) {
											// 	toast.error("Saving is too high");
											// 	return;
											// }
											setPortion(newPortion);
											setSaving(newSaving);
										}}
									/>
								) : (
									<div className="w-32 h-6 text-right">{saving.toLocaleString("hu")}</div>
								)}
							</li>

							{/* portion */}
							<li className="flex justify-between px-2">
								<div className="">Portion</div>
								{editing ? (
									<InputNumber
										width="w-32"
										value={portion}
										invalid={portion < 0}
										onChange={(newPortion) => {
											const newSaving = calculateSaving(newPortion, payments, income);
											// if (newSaving < 0) {
											// 	toast.error("Portion is too high");
											// 	return;
											// }
											setSaving(newSaving);
											setPortion(newPortion);
										}}
									/>
								) : (
									<div className="w-32 h-6 text-right">{portion.toLocaleString("hu")}</div>
								)}
							</li>
						</>
					)}
					{/* end: open saving & portion */}
				</ul >

				{/* open payments */}
				{open && (
					<>
						<div className="bg-gray-200 p-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
							<div className="">Payee</div>
							<div className="h-6 text-right">Factor</div>
							<div className="h-6 text-right hidden sm:block">Amount</div>
							<div className="h-6 text-right">Extra</div>
							<div className="h-6 text-right">Total</div>
						</div>

						<div className="grid grid-cols-4 sm:grid-cols-5 gap-2 px-2 pt-1 pb-2">
							{payments.map((payment) => (
								<Payment
									key={payment.id}
									paymentId={payment.id}
								/>
							))}
						</div>
					</>
				)}
				{/* end: open payments */}
			</div >
		</li >
	)
}
