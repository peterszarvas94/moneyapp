import type { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAccountIdParser from "~/hooks/useAccountIdParser";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useContext } from "react";
import NoAccess from "~/components/NoAccess";
import Spinner from "~/components/Spinner";
import { AccountContext } from "~/context/account";
import HeadElement from "~/components/Head";
import Header from "~/components/Header";
import PageTitle from "~/components/PageTitle";
import Label from "~/components/Label";
import { Input } from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";

const NewAdminPage: NextPage = () => {
  return (
    <>
      <HeadElement title="New Admin - Moneyapp" description="Split the money" />
      <Header />
      <PageTitle title="Add New Admin" />
      <main>
        <Page />
      </main>
    </>
  );
}

export default NewAdminPage;

function Page() {
  const { accountId } = useAccountIdParser();

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <AccountContext.Provider value={{ accountId }}>
      <IdParsed />
    </AccountContext.Provider>
  )
}

function IdParsed() {
  const { accountId } = useContext(AccountContext);
  const { data: access, error } = api.account.getAccess.useQuery({ accountId });

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <NoAccess />
    )
  }

  if (access === "admin") {
    return (
      <AdminContent />
    )
  }

  return (
    <Spinner />
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
  const { mutateAsync: addAdmin } = api.admin.addByEmail.useMutation();

  const onSubmit: SubmitHandler<Form> = async ({ email }) => {
    if (self && self.email === email) {
      toast.error("You are already an admin");
      return;
    }

    try {
      z.string().email().parse(email);
    } catch (error) {
      toast.error("Invalid email");
      return;
    }

    try {
      const isAdmin = await checkAdmin({ accountId, email });
      if (isAdmin) {
        toast.error("User is already an admin");
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    try {
      const isViewer = await checkViewer({ accountId, email });
      if (isViewer) {
        toast.error("User is already a viewer");
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    try {
      await addAdmin({ accountId, email });
      toast.success("Admin added");
      router.push(`/account/${accountId}`);
    } catch (error) {
      const trpcError = error as TRPCClientError<any>
      if (trpcError.data?.code === "NOT_FOUND") {
        toast.error("User not found");
        return;
      }

      toast.error("Something went wrong");
    }
  }

  if (!accountId) {
    return (
      <Spinner />
    )
  }

  return (
    <>
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

        <SubmitButton text="Add" />
      </form>
    </>
  )
}
