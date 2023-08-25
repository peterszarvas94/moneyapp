import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { InputNumber } from "~/components/InputNumber";
import Label from "~/components/Label";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import SubmitButton from "~/components/SubmitButton";
import { useAccountContext } from "~/context/account";
import { api } from "~/utils/api";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import BackButton from "~/components/BackButton";
import { PageContext } from "~/context/page";
import useIdParser from "~/hooks/useIdParser";
import { old_EventContext, old_useEventContext } from "~/context/event";
import Header from "~/components/nav/Header";
import Select from "~/components/Select";
import ForwardButton from "~/components/ForwardButton";

const NewPaymentPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "new-payment" }}>
      <AccessedPage title="New payment - Moneyapp" accessible="admin" >
        <Header />
        <Content />
      </AccessedPage>
    </PageContext.Provider>
  )
}

export default NewPaymentPage;

function Content() {
  const { parsedId: eventId } = useIdParser("eventId");
  if (!eventId) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  return (
    <old_EventContext.Provider value={{ eventId }}>
      <IdParsed />
    </old_EventContext.Provider>
  )
}

type Form = {
  extra: string;
  multiplier: string;
  payeeId: string;
}

function IdParsed() {

  const router = useRouter();

  const { accountId } = useAccountContext();
  const { eventId } = old_useEventContext();

  const { data: account } = api.account.get.useQuery({ accountId });
  const { data: event } = api.event.getWithPayments.useQuery({ accountId, eventId });
  const { data: payees } = api.account.getPayees.useQuery({ accountId });
  const { mutateAsync: addPayment } = api.payment.new.useMutation();

  const { handleSubmit, control } = useForm<Form>();
  const [saving, setSaving] = useState<boolean>(false);

  if (!account || !event || !payees) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const { remaining } = event;

  const options = payees.map(payee => ({
    label: payee.name,
    value: payee.id,
  }));

  if (!options[0]) {
    return (
      <div className="flex flex-col items-center py-6">
        <p className="text-lg">No payees found</p>
        <ForwardButton
          url={`/accounts/${accountId}/payees/new`}
          text="Add new payee"
        />
      </div>
    )
  }

  const onSubmit: SubmitHandler<Form> = async (data) => {
    console.log(data);
    setSaving(true);

    const { payeeId, multiplier, extra } = data;

    const parsedMutliplier = parseInt(multiplier);
    if (isNaN(parsedMutliplier)) {
      toast.error("Invalid multiplier");
      setSaving(false);
      return;
    }

    const parsedExtra = parseInt(extra);
    if (isNaN(parsedExtra)) {
      toast.error("Invalid extra");
      setSaving(false);
      return;
    }

    if (parsedExtra > remaining) {
      toast.error(`This extra expense is more than the remaining amount of the event: ${remaining}`);
      setSaving(false);
      return;
    }

    try {
      const paymentId = await addPayment({
        accountId,
        eventId,
        payeeId,
        multiplier: parsedMutliplier,
        extra: parsedExtra,
      })

      router.push(`/accounts/${accountId}/payments/${paymentId}`);
    } catch (e) {
      toast.error("Failed to add payment");
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle title="Create New Payment" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor="extra" text={`Extra expense (${account.currency})`} />
        <Controller
          control={control}
          name="extra"
          rules={{ required: true }}
          defaultValue="0"
          render={({ field }) => (
            <InputNumber
              value={field.value}
              setValue={field.onChange}
              required={true}
            />
          )}
        />

        <Label htmlFor="multiplier" text="Multiplier (how many portions?)" />
        <Controller
          control={control}
          name="multiplier"
          rules={{ required: true }}
          defaultValue="1"
          render={({ field }) => (
            <InputNumber
              value={field.value}
              setValue={field.onChange}
              required={true}
              min={1}
            />
          )}
        />

        <Label htmlFor="payeeId" text="payeeId - TODO: dropdown" />
        <Controller
          control={control}
          name="payeeId"
          rules={{ required: true }}
          defaultValue={options[0].value}
          render={({ field }) => (
            <Select
              value={field.value}
              setValue={field.onChange}
              required={true}
              options={options}
            />
          )}
        />

        {saving ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Add payment" />
        )}
      </form>
    </>
  )
}


