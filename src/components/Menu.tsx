import { useMenuContext } from "~/context/menu";
import { RiMenuFoldLine } from "react-icons/ri";
import Accounts from "./menu/Accounts";
import AccountNav from "./menu/AccountNav";
import { usePageContext } from "~/context/page";
import MemberNav from "./menu/MemberNav";

export default function Menu() {
	const { open, setOpen } = useMenuContext();

	if (!open) {
		return null;
	}

	return (
		<aside className="fixed">
			<div className="flex flex-col gap-4 w-64 h-screen p-4 bg-gray-900">

				<div className="flex justify-start items-center h-8 w-8">
					<button onClick={() => setOpen(false)}>
						<RiMenuFoldLine className="text-2xl cursor-pointer text-white" />
					</button>
				</div>

				<Elements />
			</div>
		</aside>
	);
}

function Elements() {
	const { page } = usePageContext();

	if (page === "home" || page === "accounts" || page === "new-account") {
		return <Accounts />;
	}

	if (page === "account" || page === "edit-account" || "new-member") {
		return (
			<AccountNav />
		);
	}

	if (page === "member" || page === "edit-member") {
		return (
			<MemberNav />
		);
	}

	return null;
}
