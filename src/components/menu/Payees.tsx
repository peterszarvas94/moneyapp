import { useAccountContext } from "~/context/account"
import { api } from "~/utils/api";
import DropDown from "./Dropdown";
import Skeleton from "../Skeleton";
import { DropDownItem } from "~/utils/types";

interface Props {
	selected?: string;
}

export default function Payees({ selected }: Props) {
	const { accountId } = useAccountContext();
	const { data: payees } = api.account.getPayees.useQuery({ accountId });

	if (!payees) {
		return (
			<div className="flex h-10 px-4 py-2 justify-start items-center border border-gray-700 rounded-lg">
				<Skeleton />
			</div>
		)
	}

	const items: DropDownItem[] = [];
	payees.forEach((payee) => {
		items.push({
			id: payee.id,
			url: `/accounts/${accountId}/payees/${payee.id}`,
			text: payee.name,
			selected: payee.id === selected,
		})
	})

	items.push({
		id: "new",
		url: `/accounts/${accountId}/payees/new`,
		text: "New Payee",
		newItem: true,
	})

	return (
		<DropDown title="Payees" items={items} />
	)
}
