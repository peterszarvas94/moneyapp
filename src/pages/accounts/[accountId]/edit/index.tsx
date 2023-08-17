import { toast } from "react-hot-toast";
import { NextPage } from "next";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useState } from "react";
import { useAccountContext } from "~/context/account";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NewAccount } from "~/server/db/schema";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import SubmitButton from "~/components/SubmitButton";
import { Input } from "~/components/Input";
import Label from "~/components/Label";
import PageTitle from "~/components/PageTitle";
import BackButton from "~/components/BackButton";
import { PageContext } from "~/context/page";
import Header from "~/components/nav/Header";

const EditAccountPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "edit-account" }}>
      <AccessedPage title="Account - Moneyapp" accessible="admin">
        <Header />
        <Content />
      </AccessedPage>
    </PageContext.Provider>
  )
}

export default EditAccountPage;

function Content() {
  const { accountId } = useAccountContext();
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { mutateAsync: editAccount } = api.account.update.useMutation();
  const { handleSubmit, control } = useForm<NewAccount>();
  const [saving, setSaving] = useState<boolean>(false);

  if (!account) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const onSubmit: SubmitHandler<NewAccount> = async ({ name, currency, description }) => {
    setSaving(true);
    try {
      await editAccount({
        accountId,
        name,
        currency,
        description: description ?? "",
      });
      toast.success("Account updated");
      router.push(`/accounts/${accountId}?refetch=true`);
    } catch (e) {
      toast.error("Account update failed");
      setSaving(false);
      return;
    }
  }

  return (
    <>
      <PageTitle title="Edit Account" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor='name' text="Name" />
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          defaultValue={account.name}
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="text"
              required={true}
            />
          )}
        />


        <Label htmlFor='description' text="Description" />
        <Controller
          control={control}
          name="description"
          rules={{ required: false }}
          defaultValue={account.description}
          render={({ field }) => (
            <Input
              value={field.value ?? ""}
              setValue={field.onChange}
              type="text"
              required={false}
            />
          )}
        />

        <Label htmlFor='currency' text="Currency" />
        <Controller
          control={control}
          name="currency"
          rules={{ required: true }}
          defaultValue={account.currency}
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="text"
              required={false}
            />
          )}
        />

        {saving ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Save" />
        )}
      </form>
    </>
  )
}
