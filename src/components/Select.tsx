import { Access } from "~/utils/types";

interface Props {
	required: boolean;
	value: string;
	setValue: (value: Access) => void;
	options: {
		value: string;
		label: string;
	}[];
}

export default function Select({ required, value, setValue, options }: Props) {
	return (
		<div className="py-2">
			<select
				className="p-2 border-black border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full"
				required={required}
				value={value}
				onChange={(e) => setValue(e.target.value as Access)}
			>
				{options.map((option, index) => (
					<option value={option.value} key={index}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
