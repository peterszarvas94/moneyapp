import { SignInButton } from '@clerk/nextjs';
import { IoArrowForwardCircle } from 'react-icons/io5';

export default function LoginButton() {
	return (
		<SignInButton redirectUrl="/dashboard">
			<button className="flex items-center gap-1 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg w-fit">
				<IoArrowForwardCircle />
				<div>Login</div>
			</button>
		</SignInButton>
	)
}
