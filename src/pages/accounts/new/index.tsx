import type { NewAccount } from "~/server/db/schema";
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
import { useState } from "react";
import Spinner from "~/components/Spinner";

const NewAccountPage: NextPage = () => {
  return (
    <>
      <HeadElement title="New Account - Moneyapp" description="Split the money" />
      <Header />
      <PageTitle title="Create New Account" />
      <main>
        <Page />
      </main>
    </>
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2">
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
  )
}

export default NewAccountPage;
