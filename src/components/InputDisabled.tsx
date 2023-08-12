interface Props {
	value: string;
	type: string;
}

export function InputDisabled({ value, type }: Props) {
	return (
		<div className="py-2">
			<input
				className="p-2 border-black border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full"
				type={type}
				required={false}
				value={value}
				readOnly
			/>
		</div>
	);
}
