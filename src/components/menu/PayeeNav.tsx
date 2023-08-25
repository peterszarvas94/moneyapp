import { useAccountContext } from "~/context/account"
import { usePayeeContext } from "~/context/payee";
import Accounts from "./Accounts";
import Payees from "./Payees";
import Members from "./Members";

export default function PayeeNav() {
	const { accountId } = useAccountContext();
	const { payeeId } = usePayeeContext();

	return (
		<>
			<Accounts selected={accountId} />
			<Members />
			<Payees selected={payeeId} />
		</>
	)
}
