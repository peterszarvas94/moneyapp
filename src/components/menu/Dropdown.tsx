import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import DropdownItem from "./DropdownItem";
import type { DropDownItem } from "~/utils/types";

interface Props {
	title: string;
	items: DropDownItem[];
}

export default function DropDown({ title, items }: Props) {
	const [open, setOpen] = useState(false);

	const selected = items.find((item) => item.selected);
	const titleClass = (open || (!open && selected)) ? "rounded-t-inner" : "rounded-inner";

	return (
		<div className="text-white border border-gray-700 rounded-lg">
			<button
				className="w-full"
				onClick={() => setOpen(!open)}
			>
				<div className={`flex justify-between px-4 py-2 hover:bg-gray-700 ${titleClass}`}>
					<div>
						{title}
					</div>
					<div className="flex justify-end items-center">
						{open ? <MdArrowDropUp /> : <MdArrowDropDown />}
					</div>
				</div>
			</button>
			{!open && selected && (
				<ul>
					<DropdownItem
						url={selected.url}
						text={selected.text}
						selected={true}
						last={true}
					/>
				</ul>
			)}
			{open && (
				<ul>
					{items.map((item) => (
						<DropdownItem
							key={item.id}
							url={item.url}
							text={item.text}
							newItem={item.newItem}
							selected={item.selected}
							last={item.id === "new"}
						/>
					))}
				</ul>
			)}
		</div>
	)
}
