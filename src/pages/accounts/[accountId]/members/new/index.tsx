import type { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import PageTitle from "~/components/PageTitle";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";
import Label from "~/components/Label";
import SubmitButton from "~/components/SubmitButton";
import { Input } from "~/components/Input";
import usePageLoader from "~/hooks/usePageLoader";
import { Access } from "~/utils/types";
import Select from "~/components/Select";

const NewViewerPage: NextPage = () => {
  return (
    <>
      <HeadElement title="New Member - Moneyapp" description="Split the money" />
      <Header />
      <main>
        <Page />
      </main>
    </>
  );
}

export default NewViewerPage;

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

type Form = {
  email: string;
  access: Access;
}
function AdminContent() {
  const router = useRouter();
  const { accountId } = useContext(AccountContext);
  const { handleSubmit, control } = useForm<Form>();
  const { mutateAsync: addViewer } = api.membership.addByEmail.useMutation();
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
      await addViewer({ accountId, email, access });
      toast.success("Viewer added");
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
    <>
      <PageTitle title="Add New Member" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2">
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
    </>
  )
}
