import { UserButton } from "@clerk/nextjs";
import NavLink from "./NavLink";

function PageNav() {
	return (
		<>
			<NavLink url="/" text="Home" />
			<NavLink url="/dashboard" text="Dashboard" />
			<NavLink url="/accounts" text="Accounts" />
			<li>
				<UserButton />
			</li>
		</>
	)
}

export default PageNav;
