import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import { Input } from "~/components/Input";
import { InputNumber } from "~/components/InputNumber";
import Label from "~/components/Label";
import NoAccess from "~/components/NoAccess";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import SubmitButton from "~/components/SubmitButton";
import { AccountContext } from "~/context/account";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";
import { Event } from "~/server/db/schema";
import useEventIdParser from "~/hooks/useEventIdParser";
import { EventContext } from "~/context/event";
import { parseDate } from "~/utils/date";

const EditEventPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Edit Event - Moneyapp" description="Split the money" />
      <Header />
      <PageTitle title="Edit Event" />
      <main>
        <Page />
      </main>
    </>
  );
}

export default EditEventPage;

function Page() {
  const { accountId } = useAccountIdParser();
  const { eventId } = useEventIdParser();

  if (!accountId || !eventId) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId }}>
      <EventContext.Provider value={{ eventId }}>
        <IdParsed />
      </EventContext.Provider>
    </AccountContext.Provider>
  )
}

function IdParsed() {
  const { accountId } = useContext(AccountContext);
  const { data: access, error } = api.account.getAccess.useQuery({ accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (access === "admin") {
    return (
      <AdminContent />
    )
  }

  return (
    <Spinner />
  )
}

function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
  const { data: event, error } = api.event.get.useQuery({ accountId, eventId });

  if (error) {
    return (
      <div>Event not found</div>
    )
  }

  if (!event) {
    return (
      <Spinner />
    )
  }

  return (
    <EventFound event={event} />
  )
}


type EditEvent = {
  name: string,
  description: string | null,
  income: string,
  saving: string,
  delivery: string
}
interface Props {
  event: Event;
}
function EventFound({ event }: Props) {
  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { handleSubmit, control } = useForm<EditEvent>();
  const { mutateAsync: updateEvent } = api.event.update.useMutation();

  const deliveryStr = parseDate(event.delivery);

  const onSubmit: SubmitHandler<EditEvent> = async (data: EditEvent) => {
    const { name, description, income, saving, delivery } = data;

    const parsedIncome = parseInt(income);
    if (isNaN(parsedIncome)) {
      return;
    }

    const parsedSaving = parseInt(saving);
    if (isNaN(parsedSaving)) {
      return;
    }

    if (parsedSaving > parsedIncome) {
      toast.error("Saving can't be greater than income");
      return;
    }

    const parsedDelivery = new Date(delivery);
    if (parsedDelivery.toString() === "Invalid Date") { 
      toast.error("Invalid date");
      return;
    }

    try {
      await updateEvent({
        eventId,
        accountId,
        name,
        description,
        delivery: parsedDelivery,
        income: parsedIncome,
        saving: parsedSaving,
      })

      router.push(`/accounts/${accountId}/events/${eventId}`);
    } catch (e) {
      toast.error("Failed to add event");
    }
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor="name" text="Name" />
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          defaultValue={event.name}
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="text"
              required={true}
            />
          )}
        />

        <Label htmlFor="description" text="Description" />
        <Controller
          control={control}
          name="description"
          rules={{ required: false }}
          defaultValue={event.description}
          render={({ field }) => (
            <Input
              value={field.value ?? ""}
              setValue={field.onChange}
              type="text"
              required={false}
            />
          )}
        />

        <Label htmlFor="delivery" text="Delivery" />
        <Controller
          control={control}
          name="delivery"
          rules={{ required: true }}
          defaultValue={deliveryStr}
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="date"
              required={true}
            />
          )}
        />

        <Label htmlFor="income" text={`Income amount (${account.currency})`} />
        <Controller
          control={control}
          name="income"
          rules={{ required: true }}
          defaultValue={event.income.toString() ?? ""}
          render={({ field }) => (
            <InputNumber
              value={field.value ?? ""}
              setValue={field.onChange}
              required={true}
            />
          )}
        />

        <Label htmlFor="Saving" text={`Saving amount (${account.currency})`} />
        <Controller
          control={control}
          name="saving"
          rules={{ required: true }}
          defaultValue={event.saving.toString() ?? ""}
          render={({ field }) => (
            <InputNumber
              value={field.value ?? ""}
              setValue={field.onChange}
              required={true}
            />
          )}
        />

        <SubmitButton text="Save" />
      </form>
    </>
  )
}


