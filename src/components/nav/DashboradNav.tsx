import { UserButton } from "@clerk/nextjs";
import NavLink from "./NavLink";

export default function DashboardNav() {
	return (
		<>
			<NavLink url="/accounts" text="Accounts" />
			<li>
				<UserButton />
			</li>
		</>
	)
}
