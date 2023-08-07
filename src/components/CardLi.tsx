import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

function CardLi({ children }: Props) {
	return (
		<li
			className="w-full flex items-center p-2 justify-between"
		>
			{children}
		</li>
	)
}

export default CardLi;
