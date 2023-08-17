import type { NewAccount } from "~/server/db/schema";
import type { NextPage } from "next";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import PageTitle from "~/components/PageTitle";
import Label from "~/components/Label";
import { Input } from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";
import { useState } from "react";
import Spinner from "~/components/Spinner";
import BackButton from "~/components/BackButton";
import Header from "~/components/nav/Header";
import HeadElement from "~/components/nav/HeadElement";
import { PageContext } from "~/context/page";

const NewAccountPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "new-account" }}>
      <HeadElement title="New Account - Moneyapp" description="Split the money" />
      <Header />
      <Page />
    </PageContext.Provider>
  )
}

function Page() {
  const { mutateAsync: createAccount } = api.account.new.useMutation();
  const router = useRouter();
  const { handleSubmit, control } = useForm<NewAccount>();
  const [saving, setSaving] = useState<boolean>(false);

  const onSubmit: SubmitHandler<NewAccount> = async (data: NewAccount) => {
    setSaving(true);

    try {
      const accountId = await createAccount(data);
      toast.success("Account created");
      router.push(`/accounts/${accountId}`);
    } catch (e) {
      toast.error("Account creation failed");
      setSaving(false);
      return;
    }
  }

  return (
    <main>
      <PageTitle title="Create New Account" />
      <div className="flex justify-center">
        <BackButton text="Back to accounts" url="/accounts" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor='name' text="Name" />
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


        <Label htmlFor='description' text="Description" />
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

        <Label htmlFor='currency' text="Currency" />
        <Controller
          control={control}
          name="currency"
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

        {saving ? (
          <div className="flex justify-center items-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Create Account" />
        )}
      </form>
    </main>
  )
}

export default NewAccountPage;
