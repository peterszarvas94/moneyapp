import type { Account, NewAccount } from "~/server/db/schema";
import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import HeadElement from "~/components/Head";
import PageTitle from "~/components/PageTitle";
import Label from "~/components/Label";
import { Input } from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";
import Header from "~/components/Header";

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
  const { register, handleSubmit } = useForm<NewAccount>();

  const onSubmit: SubmitHandler<NewAccount> = async (data: NewAccount) => {
    let created: Account;
    try {
      created = await createAccount(data);
    } catch (e) {
      toast.error("Account creation failed");
      return;
    }

    toast.success("Account created");
    router.push("/accounts");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
      <Label htmlFor='name' text="Name"/>
      <Input register={register} name="name" required={true} type="text"/>

      <Label htmlFor='description' text="Description"/>
      <Input register={register} name="description" required={true} type="text"/>


      <Label htmlFor='currency' text="Currency"/>
      <Input register={register} name="currency" required={true} type="text"/>

      <SubmitButton text="Create Account" />
    </form>
  )
}

export default NewAccountPage;
