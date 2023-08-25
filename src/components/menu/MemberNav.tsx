import { useAccountContext } from "~/context/account"
import { useMemberContext } from "~/context/member";
import Members from "./Members";
import Accounts from "./Accounts";
import Payees from "./Payees";

export default function MemberNav() {
	const { accountId } = useAccountContext();
	const { membershipId} = useMemberContext();

	return (
		<>
			<Accounts selected={accountId} />
			<Members selected={membershipId} />
			<Payees />
		</>
	)
}
