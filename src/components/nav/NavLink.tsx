import Link from "next/link";

interface Props {
	url: string;
	text: string;
}

function NavLink({ url, text }: Props) {
	return (
		<li>
			<Link
				href={url}
				className="text-white uppercase text-sm"
			>
				{text}
			</Link>
		</li>
	)
}

export default NavLink;
