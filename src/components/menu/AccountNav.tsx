import { useAccountContext } from "~/context/account"
import Members from "./Members";
import Accounts from "./Accounts";
import Payees from "./Payees";

export default function AccountNav() {
	const { accountId } = useAccountContext();

	return (
		<>
			<Accounts selected={accountId} />
			<Members />
			<Payees />
		</>
	)
}
