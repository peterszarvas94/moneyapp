import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { useMenuContext } from "~/context/menu";

interface Props {
	url: string;
	text: string;
	newItem?: boolean;
	selected?: boolean;
	last?: boolean;
}

export default function DropdownItem({ url, text, newItem, selected, last }: Props) {
	const { setOpen } = useMenuContext();
	const lastClass = last ? "rounded-b-inner" : "";
	const selectedClass = selected ? "bg-gray-800 text-white" : "hover:bg-gray-700";

	return (
		<li>
			<button
				className="block w-full h-full text-left"
				onClick={() => setOpen(false)}
			>

				<Link
					href={url}
					className={`block px-4 py-2 border-t border-gray-700 ${lastClass} ${selectedClass}`}
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
