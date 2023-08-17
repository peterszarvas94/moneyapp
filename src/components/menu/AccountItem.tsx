import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { useMenuContext } from "~/context/menu";

interface Props {
	url: string;
	text: string;
	newItem?: boolean;
	selected?: boolean;
}

export default function AccountItem({ url, text, newItem, selected }: Props) {
	const { setOpen } = useMenuContext();

	return (
		<li>
			<button
				className="block w-full h-full text-left"
				onClick={() => setOpen(false)}
			>

				<Link
					href={url}
					className={`block px-4 py-2 border-t border-gray-700 ${selected ? "bg-gray-700" : "hover:bg-gray-700"}`}
				>
					{newItem ? (
						<div className="flex items-center gap-1">
							<AiOutlinePlus />
							<div>{text}</div>
						</div>
					) : text}
				</Link>
			</button>
		</li>
	)
}
