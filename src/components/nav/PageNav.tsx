import { UserButton } from "@clerk/nextjs";
import NavLink from "./NavLink";

export default function PageNav() {
	return (
		<>
			<NavLink url="/dashboard" text="Dashboard" />
			<NavLink url="/accounts" text="Accounts" />
			<li>
				<UserButton />
			</li>
		</>
	)
}
