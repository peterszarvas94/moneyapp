import { UserButton } from "@clerk/nextjs";
import NavLink from "./NavLink";

export default function AccountsNav() {
	return (
		<>
			<NavLink url="/dashboard" text="Dashboard" />
			<li>
				<UserButton />
			</li>
		</>
	)
}
