import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import AccountItem from "./AccountItem";
import type { DropDownItem } from "~/utils/types";

interface Props {
	title: string;
	items: DropDownItem[];
}

export default function DropDown({ title, items }: Props) {
	const [open, setOpen] = useState(false);
	
	const selected = items.find((item) => item.selected);

	return (
		<div className="text-white border border-gray-700 rounded-lg">
			<button
				className="w-full"
				onClick={() => setOpen(!open)}
			>
				<div className={`flex justify-between px-4 py-2 hover:bg-gray-700 ${open ? "rounded-t-md" : "rounded-md"}`}>
					<div>
						{selected && !open ? selected.text : title}
					</div>
					<div className="flex justify-end items-center">
						{open ? <MdArrowDropUp /> : <MdArrowDropDown />}
					</div>
				</div>
			</button>
			{open && (
				<ul>
					{items.map((item) => (
						<AccountItem
							key={item.id}
							url={item.url}
							text={item.text}
							newItem={item.newItem}
							selected={item.selected}
						/>
					))}
				</ul>
			)}
		</div>
	)
}
