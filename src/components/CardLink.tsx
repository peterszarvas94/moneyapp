import Link from "next/link";
import { ReactNode } from "react";

interface Props {
	url: string;
	children: ReactNode;
}
function CardLink({ url, children }: Props) {
	return (
		<Link href={url} className="w-full flex items-center p-2 hover:bg-gray-600 hover:text-white">
			{children}
		</Link>
	)
}

export default CardLink;
