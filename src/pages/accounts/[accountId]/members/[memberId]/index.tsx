import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import BackButton from "~/components/BackButton";
import Card from "~/components/Card";
import CardLi from "~/components/CardLi";
import CardTitle from "~/components/CardTitle";
import DeleteButton from "~/components/DeleteButton";
import EditButton from "~/components/EditButton";
import PageTitle from "~/components/PageTitle";
import Spinner from "~/components/Spinner";
import AccessedPage from "~/components/accounts/accountId/AccessedPage";
import { useAccountContext } from "~/context/account";
import { MemberContext, useMemberContext } from "~/context/member";
import useIdParser from "~/hooks/useIdParser";
import { api } from "~/utils/api";

const MemberPage: NextPage = () => {
  return (
    <AccessedPage title="Member - Moneyapp" accessible="viewer" >
      <Content />
    </AccessedPage>
  )
}

export default MemberPage;

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

function IdParsed() {
  const router = useRouter();
  const { accountId, access } = useAccountContext();
  const { membershipId } = useMemberContext();
  const { data: member } = api.membership.get.useQuery({ accountId, membershipId });
  const { data: self } = api.user.getSelf.useQuery();
  const { mutateAsync: deleteMember } = api.membership.delete.useMutation();
  const [deleting, setDeleting] = useState<boolean>(false);

  if (!member || !self) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <PageTitle title="Member" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>
      <div className="px-4 pt-4 justify-center">
        <Card >
          <CardTitle title="Details" />
          <ul>
            <CardLi>Name: {member.user.name}</CardLi>
            <CardLi>Email: {member.user.email}</CardLi>
            <CardLi>Access: {member.access}</CardLi>
          </ul>
        </Card>
        {access === "admin" && !deleting && self.id !== member.user.id && (
          <div className="flex justify-center gap-2 pt-4">
            <EditButton text="Edit" url={`/accounts/${accountId}/members/${membershipId}/edit`} />
            <DeleteButton text="Delete" click={async () => {
              if (confirm("Are you sure you want to delete this member?")) {
                setDeleting(true);
                try {
                  await deleteMember({ accountId, membershipId });
                  toast.success("Member deleted");
                  router.push(`/accounts/${accountId}`);
                } catch (error) {
                  toast.error("Something went wrong");
                  setDeleting(false);
                }
              }
            }} />
          </div>
        )}
        {access === "admin" && deleting && self.id !== member.user.id && (
          <div className="flex justify-center pt-4">
            <Spinner />
          </div>
        )}
      </div>
    </>
  )
}
