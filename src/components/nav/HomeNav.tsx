import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import NavLink from "./NavLink";

export default function HomeNav() {
	const { isSignedIn } = useAuth();

	if (!isSignedIn) {
		return (
			<li>
				<SignInButton afterSignInUrl="/dashboard">
					<button className="text-white uppercase text-sm">
						Sign In
					</button>
				</SignInButton>
			</li>
		)
	}

	return (
		<>
			<NavLink url="/dashboard" text="Dashboard"/>
			<li className="items-center">
				<UserButton />
			</li>
		</>
	)
}
