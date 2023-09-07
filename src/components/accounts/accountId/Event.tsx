import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import EventForm from "./EventForm";
import EventLoading from "./EventLoading";
import { Event as EventType } from "~/server/db/schema";
import { useState } from "react";

interface Props {
	event: EventType;
	refetch: () => void;
}

export default function Event({ event, refetch }: Props) {
	const getEvents = refetch;
	const { accountId } = useAccountContext();
	const { data: payments, refetch: getPayemnts } = api.event.getPayments.useQuery({ accountId, eventId: event.id });
	const { data: payees } = api.account.getPayees.useQuery({ accountId });
	const { mutateAsync: updateEvent } = api.event.update.useMutation();
	const { mutateAsync: updatePayment } = api.payment.update.useMutation();
	const { mutateAsync: deletePayment } = api.payment.delete.useMutation();
	const { mutateAsync: addPayment } = api.payment.new.useMutation();
	const { mutateAsync: deleteEvent } = api.event.delete.useMutation();

	const [editing, setEditing] = useState(false);

	if (!payments || !payees) {
		return (
			<EventLoading />
		)
	}

	return (
		<EventForm
			event={event}
			payments={payments}
			payees={payees}

			editing={editing}
			setEditing={setEditing}

			onDelete={async () => {
				if (confirm("Are you sure you want to delete this event?")) {
					try {
						await deleteEvent({ accountId, eventId: event.id });
					} catch (error) {
						toast.error("Failed to delete event");
					}

					getEvents();
					getPayemnts();
				}
			}}
			onSave={async (data) => {
				const { name, income, delivery: deliveryStr, saving, payments, newPayments, deletedPayments } = data;
				const delivery = new Date(deliveryStr);

				try {
					await updateEvent({ accountId, name, income: income ?? 0, delivery, saving: saving ?? 0, eventId: event.id });
				} catch (error) {
					toast.error("Failed to update event");
				}

				for (const payment of payments) {
					try {
						await updatePayment({
							accountId,
							extra: payment.extra ?? 0,
							factor: payment.factor ?? 0,
							paymentId: payment.paymentId,
							payeeId: payment.payeeId
						});
					} catch (error) {
						toast.error("Failed to update payment");
						return;
					}
				}

				for (const payment of newPayments) {
					try {
						await addPayment({
							accountId,
							eventId: event.id,
							extra: payment.extra ?? 0,
							factor: payment.factor ?? 0,
							payeeId: payment.payeeId
						});
					} catch (error) {
						toast.error("Failed to add payment");
						return;
					}
				}

				for (const payment of deletedPayments) {
					try {
						await deletePayment({ accountId, paymentId: payment.paymentId });
					} catch (error) {
						toast.error("Failed to delete payment");
						return;
					}
				}

				setEditing(false);
				getEvents();
				getPayemnts();
			}}
		/>
	)
}
