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
import Header from "~/components/nav/Header";
import { useAccountContext } from "~/context/account";
import { PageContext } from "~/context/page";
import { PayeeContext, usePayeeContext } from "~/context/payee";
import useIdParser from "~/hooks/useIdParser";
import { api } from "~/utils/api";

const PayeePage: NextPage = () => {
  return (
    <PageContext.Provider value={{ page: "payee" }}>
      <AccessedPage title="Payee - Moneyapp" accessible="viewer" >
        <Content />
      </AccessedPage>
    </PageContext.Provider>
  )
}

export default PayeePage;

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
      <Header />
      <IdParsed />
    </PayeeContext.Provider>
  )
}

function IdParsed() {
  const router = useRouter();
  const { accountId, access } = useAccountContext();
  const { payeeId } = usePayeeContext();
  const { data: payeeWithMember } = api.payee.get.useQuery({ accountId, payeeId });
  // const { data: self } = api.user.getSelf.useQuery();
  const { mutateAsync: deletePayee } = api.payee.delete.useMutation();
  const [deleting, setDeleting] = useState<boolean>(false);

  if (!payeeWithMember || !self) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  const { payee, member } = payeeWithMember;

  return (
    <>
      <PageTitle title="Payee" />
      <div className="flex justify-center">
        <BackButton text="Back to account" url={`/accounts/${accountId}`} />
      </div>
      <div className="px-4 pt-4 justify-center">
        <Card >
          <CardTitle title="Payee details" />
          <ul>
            <CardLi>Name: {payee.name}</CardLi>
          </ul>
        </Card>
      </div>
      {member && (
        <div className="px-4 pt-4 justify-center">
          <Card >
            <CardTitle title="Connected to member" />
            <ul>
              <CardLi>Member name: {member.user.name}</CardLi>
              <CardLi>Email: {member.user.email}</CardLi>
              <CardLi>Access: {member.access}</CardLi>
            </ul>
          </Card>
        </div>
      )}
      {access === "admin" && !deleting && (
        <div className="flex justify-center gap-2 pt-4">
          <EditButton text="Edit" url={`/accounts/${accountId}/payees/${payeeId}/edit`} />
          <DeleteButton text="Delete" click={async () => {
            if (confirm("Are you sure you want to delete this payee?")) {
              setDeleting(true);
              try {
                await deletePayee({ accountId, payeeId });
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
      {access === "admin" && deleting && (
        <div className="flex justify-center pt-4">
          <Spinner />
        </div>
      )}
    </>
  )
}

