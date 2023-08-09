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
import usePageLoader from "~/hooks/usePageLoader";
import { api } from "~/utils/api";

const NewEventPage: NextPage = () => {
  return (
    <>
      <HeadElement title="New Event - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <Page />
      </main>
    </>
  );
}

export default NewEventPage;

function Page() {
  const { accountId, access } = usePageLoader();

  if (!accountId || !access) {
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
      <AdminContent />
    </AccountContext.Provider>
  )
}

type NewEvent = {
  name: string,
  description: string | null,
  income: string,
  saving: string,
  delivery: string,
}
function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { handleSubmit, control } = useForm<NewEvent>();
  const { mutateAsync: addEvent } = api.event.new.useMutation();
  const [saving, setSaving] = useState<boolean>(false);

  if (!account) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const onSubmit: SubmitHandler<NewEvent> = async (data: NewEvent) => {
    setSaving(true);

    const { name, description, delivery, income, saving } = data;

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
      const eventId = await addEvent({
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
      <PageTitle title="Create New Event" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2">
        <Label htmlFor="name" text="Name" />
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          defaultValue=""
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
          defaultValue=""
          render={({ field }) => (
            <Input
              value={field.value ?? ""}
              setValue={field.onChange}
              type="text"
              required={false}
            />
          )}
        />

        <Label htmlFor="delivery" text="Delivery date" />
        <Controller
          control={control}
          name="delivery"
          rules={{ required: true }}
          defaultValue="2023-10-03"
          render={({ field }) => (
            <Input
              value={field.value ?? ""}
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
          defaultValue="0"
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
          defaultValue="0"
          render={({ field }) => (
            <InputNumber
              value={field.value ?? ""}
              setValue={field.onChange}
              required={true}
            />
          )}
        />

        {saving ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Add event" />
        )}
      </form>
    </>
  )
}

