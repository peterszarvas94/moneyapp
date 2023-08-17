import { useAccountContext } from "~/context/account"
import { api } from "~/utils/api";
import DropDown from "./Dropdown";
import Skeleton from "../Skeleton";
import { DropDownItem } from "~/utils/types";

interface Props {
	selected?: string;
}

export default function Members({ selected }: Props) {
	const { accountId } = useAccountContext();
	const { data: members } = api.account.getMembers.useQuery({ accountId });

	if (!members) {
		return (
			<div className="flex h-10 px-4 py-2 justify-start items-center">
				<Skeleton />
			</div>
		)
	}

	const items: DropDownItem[] = [];
	members.forEach((member) => {
		items.push({
			id: member.id,
			url: `/accounts/${accountId}/members/${member.id}`,
			text: `${member.user.name} (${member.access})`,
			selected: member.id === selected,
		})
	})

	items.push({
		id: "new",
		url: `/accounts/${accountId}/members/new`,
		text: "New Member",
		newItem: true,
	})

	return (
		<DropDown title="Members" items={items} />
	)
}
