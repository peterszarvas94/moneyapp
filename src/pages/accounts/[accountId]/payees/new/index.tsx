import { TRPCClientError } from "@trpc/client";
import { TRPCErrorShape } from "@trpc/server/rpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import { Input } from "~/components/Input";
import { InputUser } from "~/components/InputUser";
import Label from "~/components/Label";
import NoAccess from "~/components/NoAccess";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import SubmitButton from "~/components/SubmitButton";
import { AccountContext } from "~/context/account";
import usePageLoader from "~/hooks/usePageLoader";
import { api } from "~/utils/api";

const NewPayeePage: NextPage = () => {
  return (
    <>
      <HeadElement title="New Payee - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <Page />
      </main>
    </>
  );
}

export default NewPayeePage;

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

type NewPayee = {
  name: string;
  email?: string;
}

function AdminContent() {
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const router = useRouter();
  const { handleSubmit, control } = useForm<NewPayee>();
  const { mutateAsync: addPayee } = api.payee.new.useMutation();
  const [saving, setSaving] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);

  if (!account) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const onSubmit: SubmitHandler<NewPayee> = async (data) => {
    setSaving(true);
    const { name, email } = data;

    if (email !== "") {
      try {
        z.string().email().parse(data.email);
      } catch (e) {
        toast.error("Invalid email address");
        setSaving(false);
        return;
      }
    }

    try {
      const payeeId = await addPayee({
        accountId,
        name,
        email: email || undefined,
      })

      router.push(`/accounts/${accountId}/payees/${payeeId}`);
    } catch (e) {
      const error = e as TRPCClientError<TRPCErrorShape>
      if (error?.data?.code === "NOT_FOUND") {
        toast.error("Member not found with the given email in this account");
        setSaving(false);
        return;
      }

      if (error?.data?.code === "CONFLICT") {
        toast.error("Payee already exists with the same email");
        setSaving(false);
        return;
      }
      toast.error("Failed to add payee");
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle title="Create New Payee" />
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

        <Label htmlFor="userId" text="Connect to a member" />
        <Controller
          control={control}
          name="email"
          rules={{ required: isMember }}
          defaultValue=""
          render={({ field }) => (
            <InputUser
              value={field.value || ""}
              setValue={field.onChange}
              isMember={isMember}
              setIsMember={setIsMember}
            />
          )}
        />

        {saving ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Add payee" />
        )}
      </form>
    </>
  )
}

