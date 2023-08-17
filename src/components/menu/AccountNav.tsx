import { useAccountContext } from "~/context/account"
import Members from "./Members";
import Accounts from "./Accounts";

export default function AccountNav() {
	const { accountId } = useAccountContext();

	return (
		<>
			<Accounts selected={accountId} />
			<Members />
		</>
	)
}
