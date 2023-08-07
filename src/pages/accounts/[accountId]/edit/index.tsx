import type { Account, NewAccount } from "~/server/db/schema";
import type { NextPage } from "next";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import HeadElement from "~/components/Head";
import PageTitle from "~/components/PageTitle";
import Label from "~/components/Label";
import { Input } from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";
import Header from "~/components/Header";
import { AccountContext } from "~/context/account";
import { useContext, useState } from "react";
import Spinner from "~/components/Spinner";
import NoAccess from "~/components/NoAccess";
import usePageLoader from "~/hooks/usePageLoader";

const EditAccountPage: NextPage = () => {
  return (
    <>
      <HeadElement title="Edit Account - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <Page />
      </main>
    </>
  )
}

function Page() {
  const { accountId, access } = usePageLoader();

  if (!accountId || !access) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  if (access === "denied") {
    return (
      <NoAccess />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId, access }}>
      <Content />
    </AccountContext.Provider>
  )
}

function Content() {
  const { accountId } = useContext(AccountContext);
  const { data: account, error } = api.account.get.useQuery({ accountId });

  if (error) {
    return (
      <p>Account not found</p>
    )
  }

  if (!account) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountFound account={account} />
  )
}


interface Props {
  account: Account
}
function AccountFound({ account }: Props) {

  const router = useRouter();
  const { accountId } = useContext(AccountContext);
  const { mutateAsync: editAccount } = api.account.update.useMutation();
  const { handleSubmit, control } = useForm<NewAccount>();
  const [saving, setSaving] = useState<boolean>(false);

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

export default EditAccountPage;
