import Spinner from "~/components/Spinner";
import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";
import AddButton from "~/components/AddButton";
import EditButton from "~/components/EditButton";
import DeleteButton from "~/components/DeleteButton";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import PageTitle from "~/components/PageTitle";
import AccountDetails from "./AccountDetails";
import PayeeList from "./PayeeList";
import MemberList from "./MemberList";

export default function Content() {
  const router = useRouter();
  const { refetch } = router.query;

  const { accountId, access } = useContext(AccountContext);

  const { data: account, refetch: getAccount } = api.account.get.useQuery({ accountId });
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();

  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof refetch === "string" && refetch === "true") {
      getAccount();
    }
  }, [refetch])

  if (!account) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <PageTitle title={access === "admin" ? "Administrate account" : "View account"} />

      <AccountDetails />
      {access === "admin" && !deleting && (
        <>
          <div className="pt-4 flex justify-center gap-2">
            <EditButton
              url={`/accounts/${account.id}/edit`}
              text="Edit"
            />
            <DeleteButton
              click={async () => {
                if (confirm("Are you sure?")) {
                  setDeleting(true);
                  try {
                    await deleteAccount({ accountId })
                    toast.success("Account deleted");
                    router.push("/accounts");
                  } catch (e) {
                    toast.error("Account deletion failed");
                    setDeleting(false);
                  }
                }
              }}
              text="Delete"
            />
          </div>
        </>
      )}

      {access === "admin" && deleting && (
        <div className="flex pt-5 pb-1 justify-center items-center">
          <Spinner />
        </div>
      )}

      <MemberList />

      {access === "admin" && (
        <div className="pt-4 flex justify-center">
          <AddButton url={`/accounts/${accountId}/members/new`} text="New member" />
        </div>
      )}


      <EventList />

      {access === "admin" && (
        <div className="pt-4 flex justify-center">
          <AddButton url={`/accounts/${accountId}/events/new`} text="New event" />
        </div>
      )}

      <PayeeList />

      {access === "admin" && (
        <div className="py-4 flex justify-center">
          <AddButton url={`/accounts/${accountId}/payees/new`} text="New payee" />
        </div>
      )}
    </>
  )
}
