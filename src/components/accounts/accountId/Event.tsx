import { toast } from "react-hot-toast";
import { calculatePortion } from "~/utils/money";
import { EventContextProvider, useEventContext } from "~/context/event";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";
import Spinner from "~/components/Spinner";
import EventForm from "./EventForm";
import EventLoading from "./EventLoading";
import { useEventListContext } from "~/context/eventlist";

interface Props {
	eventId: string;
}

export default function Event({ eventId }: Props) {
	const { accountId } = useAccountContext();
	const { data: payments } = api.event.getPayments.useQuery({ accountId, eventId });
	const { data: event } = api.event.get.useQuery({ accountId, eventId });

	if (!event || !payments) {
		return (
			<EventLoading />
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
	const { accountId } = useAccountContext();
	const { getEvents } = useEventListContext();
	const { mutateAsync: updateEvent } = api.event.update.useMutation();
	const { mutateAsync: updatePayment } = api.payment.update.useMutation();

	const {
		event,
		setInitialEvent,
		payments,
		setInitialPayments,
		saving,
		setInitialSaving,
		portion,
		setInitialPortion,
		setEditing
	} = useEventContext();

	const { id, name, delivery, income } = event;


	return (
		<EventForm
			onSave={async () => {
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
				getEvents();
			}}
		/>
	)
}
