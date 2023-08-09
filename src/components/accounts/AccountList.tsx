import { api } from "~/utils/api";
import Card from "../Card";
import CardTitle from "../CardTitle";
import CardLink from "../CardLink";
import CardNoItem from "../CardNoItem";
import CardLoading from "../CardLoading";
import { Account } from "~/server/db/schema";

export default function AccountList() {
  const { data } = api.membership.getAccounts.useQuery();

  const adminAccounts = data?.filter(e => e.access === "admin").map(e => e.account);
  const viewerAccounts = data?.filter(e => e.access === "viewer").map(e => e.account);

  return (
    <>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Administrated" />
          <AdminAccounts accounts={adminAccounts} />
        </Card>
      </div>
      <div className="px-4 pt-4">
        <Card>
          <CardTitle title="Viewed" />
          <ViewerAccounts accounts={viewerAccounts} />
        </Card>
      </div>
    </>
  )
}

interface Props {
  accounts: Account[] | undefined;
}

function AdminAccounts({ accounts }: Props) {
  if (!accounts) {
    return (
      <CardLoading />
    )
  }

  if (accounts.length === 0) {
    return (
      <CardNoItem>No administrated accounts.</CardNoItem>
    )
  }

  return (
    <ul>
      {accounts.map((account) => (
        <CardLink
          key={account.id}
          url={`/accounts/${account.id}`}
          text={account.name}
        />
      ))}
    </ul>
  )
}

function ViewerAccounts({ accounts }: Props) {
  if (!accounts) {
    return (
      <CardLoading />
    )
  }

  if (accounts.length === 0) {
    return (
      <CardNoItem>No viewed accounts.</CardNoItem>
    )
  }

  return (
    <ul>
      {accounts.map((account) => (
        <CardLink
          key={account.id}
          url={`/accounts/${account.id}`}
          text={account.name}
        />
      ))}
    </ul>
  )
}
