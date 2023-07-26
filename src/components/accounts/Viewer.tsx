import Link from "next/link";
import { Account } from "~/server/db/schema";

interface Props {
  accounts: Account[];
}
function Viewer({ accounts }: Props) {
  if (accounts.length === 0) {
    return "No viewed accounts."
  }

  return (
    <>
      <div>
        My viewed accounts:
      </div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/dashboard/accounts/${account.id}`}
              className='underline'
            >
              {account.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Viewer;
