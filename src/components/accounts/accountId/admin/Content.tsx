import Link from "next/link";
import Spinner from "~/components/Spinner";
import AdminList from "./AdminList";
import ViewerList from "./ViewerList";
import EventList from "./EventList";
import AccountDetails from "./AccountDetails";
import { useContext } from "react";
import { AccountContext } from "~/context/account";
import Header from "~/components/Header";
import PageTitle from "~/components/PageTitle";
import { api } from "~/utils/api";
import AddButton from "~/components/AddButton";
import EditButton from "~/components/EditButton";
import DeleteButton from "~/components/DeleteButton";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

function AdminContent() {
  const router = useRouter();
  const { accountId } = useContext(AccountContext);
  const { data: account } = api.account.get.useQuery({ accountId });
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();

  if (!accountId || !account) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <Header />
      <PageTitle title={`Administrate \"${account.name}\"`} />

      <AdminList />
      <div className="px-4 flex justify-center">
        <AddButton url={`/accounts/${accountId}/admins/new`} text="New admin" />
      </div>

      <ViewerList />
      <div className="px-4 flex justify-center">
        <AddButton url={`/accounts/${accountId}/viewers/new`} text="New viewer" />
      </div>

      <AccountDetails />
      <div className="px-4 flex justify-center gap-2">
        <EditButton
          url={`/accounts/${account.id}/edit`}
          text="Edit"
        />
        <DeleteButton
          click={async () => {
            // fix this
            if (confirm("Are you sure?")) {
              try {
                await deleteAccount({ accountId })
                toast.success("Account deleted");
                router.push("/accounts");
              } catch (e) {
                console.log(e)
              }
            }
          }}
          text="Delete"
        />
      </div>

      <EventList />
      <div className="px-4 flex justify-center">
        <AddButton url={`/accounts/${accountId}/events/new`} text="New event" />
      </div>
    </>
  )
}

export default AdminContent;
