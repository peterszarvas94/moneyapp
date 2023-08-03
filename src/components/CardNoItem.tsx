import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

function CardNoItem({ children }: Props) {
	return (
		<p className="p-2 italic">
			{children}
		</p>
	)
}

export default CardNoItem;
