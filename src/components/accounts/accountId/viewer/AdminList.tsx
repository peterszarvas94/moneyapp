import { useContext } from "react";
import Skeleton from "~/components/Skeleton";
import { AccountContext } from "~/context/account";
import { api } from "~/utils/api";

function AdminList() {
  return (
    <>
      <div className="pt-6 italic">Admins of this account:</div>
      <List />
    </>
  )
}

function List() {
  const { accountId } = useContext(AccountContext);
  const { data: admins } = api.account.getAdmins.useQuery({ accountId });

  if (!admins) {
    return (
      <Skeleton />
    )
  }

  if (admins.length === 0) {
    return (
      <div>No admins</div>
    )
  }

  return (
    <ul>
      {
        admins.map((admin) => (
          <li key={admin.id} className="flex items-center">
            {`${admin.name} (${admin.email})`}
          </li>
        ))
      }
    </ul>
  )
}

export default AdminList;
