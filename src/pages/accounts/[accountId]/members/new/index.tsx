import type { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "~/components/Spinner";
import PageTitle from "~/components/PageTitle";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";
import Label from "~/components/Label";
import SubmitButton from "~/components/SubmitButton";
import { Input } from "~/components/Input";
import { Access } from "~/utils/types";
import Select from "~/components/Select";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";
import BackButton from "~/components/BackButton";
import { PageContext } from "~/context/page";
import Header from "~/components/nav/Header";

const NewMemberPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "new-member" }}>
      <AccessedPage title="Member - Moneyapp" accessible="admin">
        <Header />
        <Content />
      </AccessedPage>
    </PageContext.Provider>
  )
}

export default NewMemberPage;

type Form = {
  email: string;
  access: Access;
}
function Content() {
  const router = useRouter();
  const { accountId } = useAccountContext();
  const { handleSubmit, control } = useForm<Form>();
  const { mutateAsync: addMember } = api.membership.addByEmail.useMutation();
  const [saving, setSaving] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setSaving(true);
    const { email, access } = data;

    try {
      z.string().email().parse(email);
    } catch (error) {
      toast.error("Invalid email");
      setSaving(false);
      return;
    }

    try {
      await addMember({ accountId, email, access });
      toast.success("Member added");
      router.push(`/accounts/${accountId}`);
    } catch (error) {
      const trpcError = error as TRPCClientError<any>
      if (trpcError.data?.code === "NOT_FOUND") {
        toast.error("User not found");
        setSaving(false);
        return;
      }

      if (trpcError.data?.code === "CONFLICT") {
        toast.error("User is already an admin or viewer");
        setSaving(false);
        return;
      }

      toast.error("Something went wrong");
      setSaving(false);
    }
  }

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <main>
      <PageTitle title="Add New Member" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor="email" text="Email" />
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <Input
              value={field.value}
              setValue={field.onChange}
              type="email"
              required={true}
            />
          )}
        />

        <Label htmlFor="access" text="Access" />
        <Controller
          control={control}
          name="access"
          rules={{ required: true }}
          defaultValue="viewer"
          render={({ field }) => (
            <Select
              value={field.value}
              setValue={field.onChange}
              required={true}
              options={[
                { value: "viewer", label: "Viewer" },
                { value: "admin", label: "Admin" },
              ]}
            />
          )}
        />

        {saving ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <SubmitButton text="Add" />
        )}
      </form>
    </main>
  )
}
