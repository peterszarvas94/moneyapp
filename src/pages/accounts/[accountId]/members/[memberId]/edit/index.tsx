import type { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "~/components/Spinner";
import PageTitle from "~/components/PageTitle";
import { TRPCClientError } from "@trpc/client";
import Label from "~/components/Label";
import SubmitButton from "~/components/SubmitButton";
import { Access } from "~/utils/types";
import Select from "~/components/Select";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";
import { InputDisabled } from "~/components/InputDisabled";
import useIdParser from "~/hooks/useIdParser";
import { MemberContext, useMemberContext } from "~/context/member";
import BackButton from "~/components/BackButton";
import { PageContext } from "~/context/page";
import Header from "~/components/nav/Header";

const EditMemberPage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "edit-member" }}>
      <AccessedPage title="Member - Moneyapp" accessible="admin" >
        <Header />
        <Content />
      </AccessedPage>
    </PageContext.Provider>
  )
}

export default EditMemberPage;

function Content() {
  const { parsedId: membershipId } = useIdParser("memberId");

  if (!membershipId) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  return (
    <MemberContext.Provider value={{ membershipId }}>
      <IdParsed />
    </MemberContext.Provider>
  )
}

type Form = {
  access: Access
}

function IdParsed() {
  const { accountId } = useAccountContext();
  const { membershipId } = useMemberContext();
  const { data: member } = api.membership.get.useQuery({ accountId, membershipId });
  const router = useRouter();
  const { handleSubmit, control } = useForm<Form>();
  const { mutateAsync: editMember } = api.membership.update.useMutation();
  const [saving, setSaving] = useState<boolean>(false);

  if (!member) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setSaving(true);
    const { access } = data;

    try {
      await editMember({ accountId, membershipId, access });
      toast.success("Member updated");
      router.push(`/accounts/${accountId}/members/${membershipId}`);
    } catch (error) {
      const trpcError = error as TRPCClientError<any>
      if (trpcError.data?.code === "NOT_FOUND") {
        toast.error("Member not found");
        setSaving(false);
        return;
      }

      if (trpcError.data?.code === "CONFLICT") {
        toast.error("You can not update yourself");
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
      <PageTitle title="Edit Member" />
      <div className="flex justify-center">
        <BackButton text="Back to member" url={`/accounts/${accountId}/members/${membershipId}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-2">
        <Label htmlFor="email" text="Email" />
        <InputDisabled
          value={member.user.email}
          type="email"
        />

        <Label htmlFor="access" text="Access" />
        <Controller
          control={control}
          name="access"
          rules={{ required: true }}
          defaultValue={member.access}
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
          <SubmitButton text="Save" />
        )}
      </form>
    </>
  )
}
