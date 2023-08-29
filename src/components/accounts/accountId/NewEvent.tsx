import { useAccountContext } from "~/context/account";
import { EventContextProvider, useEventContext } from "~/context/event";
import { Event } from "~/server/db/schema";
import { PaymentWithPayee } from "~/utils/types";
import EventForm from "./EventForm";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useEventListContext } from "~/context/eventlist";


export default function NewEvent() {
  const { accountId } = useAccountContext();

  const now = new Date();

  const event: Event = {
    id: "",
    name: "",
    description: "",
    income: 0,
    delivery: now,
    createdAt: now,
    updatedAt: now,
    accountId,
  }

  const payments: PaymentWithPayee[] = [];
  const saving = 0;
  const portion = 0;

  return (
    <EventContextProvider
      event={event}
      payments={payments}
      saving={saving}
      portion={portion}
      editing={true}
    >
      <Details />
    </EventContextProvider>
  );
}

function Details() {
  const { accountId } = useAccountContext();
  const { mutateAsync: newEvent } = api.event.new.useMutation();
  const { mutateAsync: newPayment } = api.payment.new.useMutation();
  const { setAdding, getEvents } = useEventListContext();
  const { event, payments, saving } = useEventContext();

  return (
    <EventForm
      onSave={async () => {
        try {
          await newEvent({
            name: event.name,
            description: event.description,
            income: event.income,
            delivery: event.delivery,
            saving,
            accountId: event.accountId,
          });
          payments.forEach(async (payment) => {
            await newPayment({
              eventId: event.id,
              accountId,
              payeeId: payment.payee.id,
              factor: payment.factor,
              extra: payment.extra,
            });
          });
          setAdding(false);
          getEvents();
        } catch (error) {
          toast.error("Failed to create event");
        }
      }}
    />
  )
}
