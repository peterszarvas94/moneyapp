import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "~/components/Input";
import Label from "~/components/Label";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import SubmitButton from "~/components/SubmitButton";
import { useAccountContext } from "~/context/account";
import { api } from "~/utils/api";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import BackButton from "~/components/BackButton";
import { InputNumber } from "~/components/InputNumber_old";

const NewEventPage: NextPage = () => {
  return (
    <AccessedPage title="New event - Moneyapp" accessible="admin" >
      <Content />
    </AccessedPage>
  )
}

export default NewEventPage;

type NewEvent = {
  name: string,
  description: string | null,
  income: string,
  saving: string,
  delivery: string,
}
function Content() {
  const { accountId } = useAccountContext();
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
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
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

