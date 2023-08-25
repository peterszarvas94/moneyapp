import { useMenuContext } from "~/context/menu";
import { RiMenuFoldLine } from "react-icons/ri";
import Accounts from "./menu/Accounts";
import AccountNav from "./menu/AccountNav";
import { usePageContext } from "~/context/page";
import MemberNav from "./menu/MemberNav";
import PayeeNav from "./menu/PayeeNav";
import Link from "next/link";
import { BiSolidDashboard } from "react-icons/bi";
import { api } from "~/utils/api";
import { useAccountContext } from "~/context/account";

export default function Menu() {
	// prefetch
	api.membership.getAccounts.useQuery();
	try {
		const { accountId } = useAccountContext();
		api.account.getMembers.useQuery({ accountId });
		api.account.getPayees.useQuery({ accountId });
	} catch (error) {
		// ignore
	}

	const { open, setOpen } = useMenuContext();
	const { page } = usePageContext();

	if (!open) {
		return null;
	}

	const dashboardClass = page === "dashboard" ? "bg-gray-800" : "hover:bg-gray-700";

	return (
		<aside className="fixed">
			<div className="flex flex-col gap-4 w-64 h-screen p-4 bg-gray-900">

				<div className="flex justify-between items-center h-8">
					<button
						onClick={() => setOpen(false)}
						className="w-8"
					>
						<RiMenuFoldLine className="text-2xl cursor-pointer text-white" />
					</button>
					<Link
						href="/dashboard"
						className={`flex gap-2 items-center text-white border border-gray-700 rounded-lg px-4 py-2 ${dashboardClass}`}
					>
						<div>Dashboard</div>
						<BiSolidDashboard />
					</Link>
				</div>

				<Elements />
			</div>
		</aside>
	);
}

function Elements() {
	const { page } = usePageContext();

	if (page === "home" || page === "dashboard" || page === "new-account") {
		return <Accounts />;
	}

	if (
		page === "account" || page === "edit-account" ||
		page === "new-member" ||
		page === "new-payee" ||
		page === "new-event" || page === "event" || page === "edit-event" ||
		page === "new-payment" || page === "payment" || page === "edit-payment"
	) {
		return (
			<AccountNav />
		);
	}

	if (page === "member" || page === "edit-member") {
		return (
			<MemberNav />
		);
	}

	if (page === "payee" || page === "edit-payee") {
		return (
			<PayeeNav />
		);
	}

	return null;
}
