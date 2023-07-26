import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "~/components/Skeleton";
import { AppContext } from "~/context/app";
import { api } from "~/utils/api";

function AccountDetails() {
  const router = useRouter();
  const { account } = useContext(AppContext);
  const { mutateAsync: deleteAdmins } = api.account.deleteAdmins.useMutation();
  const { mutateAsync: deleteEvents } = api.account.deleteEvents.useMutation();
  const { mutateAsync: deleteViewers } = api.account.deleteViewers.useMutation();
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation();

  if (!account) {
    return (
      <Skeleton />
    )
  }

  return (
    <>
      <div className="pt-6 italic">Account details:</div>
      <ul>
        <li>Name: {account.name}</li>
        <li>Description: {account.description}</li>
        <li>Currency: {account.currency}</li>
        <li>
          <Link
            href={`/dashboard/accounts/${account.id}/edit`}
            className="underline"
          >
            Edit
          </Link>

        </li>
        <li>
          <button
            className="underline"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                try {
                  await deleteViewers({
                    accountId: account.id,
                  })
                } catch (e) { }

                try {
                  await deleteAdmins({
                    accountId: account.id,
                  })
                } catch (e) {
                  return;
                }

                try {
                  await deleteEvents({
                    accountId: account.id
                  })
                } catch (e) {
                  return;
                }

                try {
                  await deleteAccount({ id: account.id })
                  toast.success("Account deleted");
                  router.push("/dashboard/accounts");
                } catch (e) {
                  return;
                }
              }
            }}
          >
            Delete
          </button>
        </li>
      </ul>
    </>
  )
}

export default AccountDetails;
