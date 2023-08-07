import Link from "next/link";

interface Props {
	url: string;
	text: string;
}
function CardLink({ url, text }: Props) {
	return (
		<li>
			<Link
				href={url}
				className="w-full block p-2 hover:bg-gray-600 hover:text-white"
			>
				{text}
			</Link>
		</li>
	)
}

export default CardLink;
