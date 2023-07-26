import { useContext } from "react"
import Skeleton from "~/components/Skeleton";
import { AppContext } from "~/context/app"

function AccountDetails() {
  const { account } = useContext(AppContext);

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
      </ul>
    </>
  )
}

export default AccountDetails;
