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
import { AiFillEdit, AiFillSave } from "react-icons/ai";

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
		payments,
		saving,
		setSaving,
		portion,
		setPortion,
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
				<ul className="flex flex-col gap-2">

					{/* name */}
					<li className="flex justify-between bg-gray-200 rounded-t-inner p-2">
						{editing ? (
							<input
								className="w-32 h-6 border border-black rounded px-2"	
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
							{isAdmin && (
								<button
									onClick={async () => {
										setEditing(!editing);
										{/*
										if (editing) {
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
												}
											}
										}
										*/}
									}}
								>
									{isAdmin && editing ? (
										<AiFillSave />
									) : (
										<AiFillEdit />
									)}
								</button>
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
							<div className="w-32 h-6 text-right">
								<InputMoney
									min={0}
									value={income}
									onChange={(newIncome) => {
										const realIncome = newIncome ?? 0;
										const newPortion = calculatePortion(saving, payments, realIncome);
										if (newPortion < 0) {
											toast.error("Income is too low");
											return;
										}
										setPortion(newPortion);
										const newEvent = { ...event, income: realIncome };
										setEvent(newEvent);
									}}
								/>
							</div>
						) : (
							<div>{income.toLocaleString("hu")}</div>
						)}
					</li>

					{open && (
						<>
							{/* saving */}
							<li className="flex justify-between px-2">
								<div className="">Saving</div>
								{editing ? (
									<div className="w-32 text-right">
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
								) : (
									<div>{saving.toLocaleString("hu")}</div>
								)}
							</li>

							{/* portion */}
							<li className="flex justify-between">
								<div className="">Portion</div>
								{editing ? (
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
								) : (
									<div>{portion.toLocaleString("hu")}</div>
								)}
							</li>
						</>
					)}
				</ul>

				{/* payments */}
				{open && (
					<div className="grid grid-cols-payee gap-2 p-2">
						<div>Payee</div>
						<div className="font-normal text-right">Rata</div>
						<div className="font-normal text-right">Amount</div>
						<div className="font-normal text-right">Extra</div>
						<div className="font-normal text-right">Total</div>

						{payments.map((payment) => (
							<Payment
								key={payment.id}
								paymentId={payment.id}
							/>
						))}
					</div>
				)}
			</div>
		</li >
	)
}
