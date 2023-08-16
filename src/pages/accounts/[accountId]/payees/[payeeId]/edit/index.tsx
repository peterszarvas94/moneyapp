import { TRPCClientError } from "@trpc/client";
import { TRPCErrorShape } from "@trpc/server/rpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import BackButton from "~/components/BackButton";
import { Input } from "~/components/Input";
import { InputUser } from "~/components/InputUser";
import Label from "~/components/Label";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import SubmitButton from "~/components/SubmitButton";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";
import { PayeeContext, usePayeeContext } from "~/context/payee";
import useIdParser from "~/hooks/useIdParser";
import { api } from "~/utils/api";

const NewPayeePage: NextPage = () => {
  return (
    <AccessedPage title="Edit Payee - Moneyapp" accessible="admin" >
      <Content />
    </AccessedPage>
  )
}

export default NewPayeePage;

function Content() {
  const { parsedId: payeeId } = useIdParser("payeeId");

  if (!payeeId) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  return (
    <PayeeContext.Provider value={{ payeeId }}>
      <IdParsed />
    </PayeeContext.Provider>
  )
}

type NewPayee = {
  name: string;
  email?: string;
}

function IdParsed() {
  const router = useRouter();
  const { accountId } = useAccountContext();
  const { payeeId } = usePayeeContext();
  const { data: payeeWithMember } = api.payee.get.useQuery({ accountId, payeeId });
  const { data: self } = api.user.getSelf.useQuery();
  const { handleSubmit, control } = useForm<NewPayee>();
  const { mutateAsync: editPayee } = api.payee.update.useMutation();
  const [saving, setSaving] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isSelf, setIsSelf] = useState<boolean>(false);

  if (!payeeWithMember) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  useEffect(() => {
    setIsMember(payeeWithMember.member !== null);
  }, [payeeWithMember]);

  useEffect(() => {
    const member = payeeWithMember.member;
    if (member && self) {
      setIsSelf(member.user.email === self.email);
    }
  }, [payeeWithMember, self]);

  const { payee, member } = payeeWithMember;

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
      await editPayee({
        payeeId,
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
      <PageTitle title="Edit Payee" />
      <div className="flex justify-center">
        <BackButton text="Back to payee" url={`/accounts/${accountId}/payees/${payeeId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor="name" text="Name" />
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          defaultValue={payee.name}
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="text"
              required={true}
            />
          )}
        />

        <Label htmlFor="email" text="Connect to a member" />
        <Controller
          control={control}
          name="email"
          rules={{ required: isMember }}
          defaultValue={member?.user.email || ""}
          render={({ field }) => (
            <InputUser
              value={field.value || ""}
              setValue={field.onChange}
              isMember={isMember}
              setIsMember={setIsMember}
              isSelf={isSelf}
              setIsSelf={setIsSelf}
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
