import type { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAccountIdParser from "~/hooks/useAccountIdParser";
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
import { boolean, z } from "zod";
import { TRPCClientError } from "@trpc/client";
import Label from "~/components/Label";
import SubmitButton from "~/components/SubmitButton";
import { Input } from "~/components/Input";
import usePageLoader from "~/hooks/usePageLoader";

const NewViewerPage: NextPage = () => {
  useAccountIdParser();
  return (
    <>
      <HeadElement title="New Viewer - Moneyapp" description="Split the money" />
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
  email: string
}
function AdminContent() {
  const router = useRouter();
  const { accountId } = useContext(AccountContext);
  const { data: self } = api.user.getSelf.useQuery();
  const { handleSubmit, control } = useForm<Form>();
  const { mutateAsync: checkAdmin } = api.admin.checkAccessByEmail.useMutation();
  const { mutateAsync: checkViewer } = api.viewer.checkAccessByEmail.useMutation();
  const { mutateAsync: addViewer } = api.viewer.addByEmail.useMutation();
  const [saving, setSaving] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Form> = async ({ email }) => {
    setSaving(true);

    if (self && self.email === email) {
      toast.error("You are already an admin, can not add yourself as a viewer");
      setSaving(false);
      return;
    }

    try {
      z.string().email().parse(email);
    } catch (error) {
      toast.error("Invalid email");
      setSaving(false);
      return;
    }

    try {
      const isAdmin = await checkAdmin({ accountId, email });
      if (isAdmin) {
        toast.error("User is already an admin");
        setSaving(false);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
      setSaving(false);
      return;
    }

    try {
      const isViewer = await checkViewer({ accountId, email });
      if (isViewer) {
        toast.error("User is already a viewer");
        setSaving(false);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
      setSaving(false);
      return;
    }

    try {
      await addViewer({ accountId, email });
      toast.success("Viewer added");
      router.push(`/accounts/${accountId}`);
    } catch (error) {
      const trpcError = error as TRPCClientError<any>
      if (trpcError.data?.code === "NOT_FOUND") {
        toast.error("User not found");
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
      <PageTitle title="Add New Viewer" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-4 px-2">
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
