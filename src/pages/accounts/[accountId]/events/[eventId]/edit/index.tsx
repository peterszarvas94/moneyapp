import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
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
import { api } from "~/utils/api";
import useEventIdParser from "~/hooks/useEventIdParser";
import { EventContext } from "~/context/event";
import { parseDate } from "~/utils/date";
import usePageLoader from "~/hooks/usePageLoader";

const EditEventPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Edit Event - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <Page />
      </main>
    </>
  );
}

export default EditEventPage;

function Page() {
  const { accountId, access } = usePageLoader();
  const { eventId } = useEventIdParser();

  if (!accountId || !eventId || !access) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  if (access === "denied" || access === "viewer") {
    return (
      <NoAccess />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId, access }}>
      <EventContext.Provider value={{ eventId }}>
        <AdminContent />
      </EventContext.Provider>
    </AccountContext.Provider>
  )
}

type EditEvent = {
  name: string,
  description: string | null,
  income: string,
  saving: string,
  delivery: string
}

function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { eventId } = useContext(EventContext);
  const { data: event } = api.event.get.useQuery({ accountId, eventId });
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { handleSubmit, control } = useForm<EditEvent>();
  const { mutateAsync: updateEvent } = api.event.update.useMutation();
  const [saving, setSaving] = useState<boolean>(false);

  if (!event || !account) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const deliveryStr = parseDate(event.delivery);

  const onSubmit: SubmitHandler<EditEvent> = async (data: EditEvent) => {
    setSaving(true);
    const { name, description, income, saving, delivery } = data;

    const parsedIncome = parseInt(income);
    if (isNaN(parsedIncome)) {
      toast.error("Invalid income");
      setSaving(false);
      return;
    }

    const parsedSaving = parseInt(saving);
    if (isNaN(parsedSaving)) {
      toast.error("Invalid saving");
      setSaving(false);
      return;
    }

    if (parsedSaving > parsedIncome) {
      toast.error("Saving can't be greater than income");
      setSaving(false);
      return;
    }

    const parsedDelivery = new Date(delivery);
    if (parsedDelivery.toString() === "Invalid Date") {
      toast.error("Invalid date");
      setSaving(false);
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
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle title="Edit Event" />
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

        {saving ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Save" />
        )}
      </form>
    </>
  )
}


