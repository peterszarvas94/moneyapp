import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import MenuButton from "./MenuButton";
import { MenuProvider } from "~/context/menu";
import Menu from "../Menu";

export default function Header() {
	return (
		<MenuProvider>
			<Menu />
			<div className="flex justify-between items-center p-4 bg-gray-600">
				<div className="flex justify-start items-center w-8">
					<MenuButton />
				</div>
				<div className="flex justify-center items-center">
					<Logo />
				</div>
				<div className="flex justify-end items-center w-8">
					<UserButton />
				</div>
			</div>
		</MenuProvider>
	);
}
