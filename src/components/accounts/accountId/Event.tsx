import { toast } from "react-hot-toast";
import { EventContextProvider, useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import EventForm from "./EventForm";
import EventLoading from "./EventLoading";
import { useEventListContext } from "~/context/eventlist";

interface Props {
	eventId: string;
}

export default function Event({ eventId }: Props) {
	const { accountId } = useAccountContext();
	const { data: payments } = api.event.getPayments.useQuery({ accountId, eventId });
	const { events } = useEventListContext();
	const event = events?.find((event) => event.id === eventId);

	if (!event) {
		return null;
	}

	if (!payments) {
		return (
			<EventLoading />
		)
	}

	return (
		<EventContextProvider
			event={event}
			payments={payments}
		>
			<Details />
		</EventContextProvider>
	)
}

function Details() {
	const { accountId } = useAccountContext();
	const { getEvents } = useEventListContext();
	const { mutateAsync: updateEvent } = api.event.update.useMutation();
	const { mutateAsync: updatePayment } = api.payment.update.useMutation();
	const { mutateAsync: deleteEvent } = api.event.delete.useMutation();

	const {
		event,
		payments,
		setEditing,
	} = useEventContext();

	const { id } = event;

	return (
		<EventForm
			onDelete={async () => {
				if (confirm("Are you sure you want to delete this event?")) {
					try {
						await deleteEvent({ accountId, eventId: id });
					} catch (error) {
						toast.error("Failed to delete event");
					}
					getEvents();
				}
			}}
			onSave={async (data) => {
				const { name, income, delivery: deliveryStr } = data;
				const delivery = new Date(deliveryStr);

				try {
					await updateEvent({ accountId, name, income, delivery, eventId: id });
				} catch (error) {
					toast.error("Failed to update event");
				}

				// for (const payment of payments) {
				// 	try {
				// 		await updatePayment({
				// 			accountId,
				// 			extra: payment.extra,
				// 			factor: payment.factor,
				// 			paymentId: payment.id,
				// 			payeeId: payment.payee.id
				// 		});
				// 	} catch (error) {
				// 		toast.error("Failed to update payment");
				// 		return;
				// 	}
				// }

				setEditing(false);
				getEvents();
			}}
		/>
	)
}
