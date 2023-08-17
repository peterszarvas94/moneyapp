import type { DropDownItem } from "~/utils/types";
import { api } from "~/utils/api";
import Skeleton from "../Skeleton";
import DropDown from "./Dropdown";

interface Props {
	selected?: string;
}

export default function Accounts({ selected }: Props) {
	const { data: accessWithAccount } = api.membership.getAccounts.useQuery();

	if (!accessWithAccount) {
		return (
			<div className="flex h-10 px-4 py-2 justify-start items-center">
				<Skeleton />
			</div>
		)
	}

	const accounts = accessWithAccount.map(e => e.account);

	if (accounts.length === 0) {
		return (
			<div>No administrated accounts.</div>
		)
	}

	const items: DropDownItem[] = [];
	accounts.forEach((account) => {
		items.push({
			id: account.id,
			url: `/accounts/${account.id}`,
			text: account.name,
			selected: account.id === selected,
		})
	})

	items.push({
		id: "new",
		url: "/accounts/new",
		text: "New Account",
		newItem: true,
	})

	return (
		<>
			<DropDown title="Accounts" items={items} />
		</>
	)
}
