import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

function CardLi({ children }: Props) {
	return (
		<li
			className="w-full flex items-center p-2 hover:bg-gray-600 hover:text-white justify-between"
		>
			{children}
		</li>
	)
}

export default CardLi;
