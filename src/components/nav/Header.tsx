import type { Page } from "~/utils/types";
import HomeNav from "./HomeNav";
import Logo from "./Logo";
import PageNav from "./PageNav";
import DashboardNav from "./DashboradNav";
import AccountsNav from "./AccountsNav";

interface Props {
	page?: Page;
}

export default function Header({ page }: Props) {
	return (
		<div className="flex justify-between p-4 bg-gray-600">
			<Logo />
			<nav className="flex items-center">
				<ul className="flex gap-4 items-center">
					<NavBar page={page} />
				</ul>
			</nav>
		</div>
	);
}

function NavBar({ page }: Props) {
	if (page === "home") {
		return <HomeNav />;
	}

	if (page === "dashboard") {
		return <DashboardNav />;
	}

	if (page === "accounts") {
		return <AccountsNav />;
	}

	return <PageNav />;
}
