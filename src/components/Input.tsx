interface Props {
	required: boolean;
	value: string;
	setValue: (value: string) => void;
	type: string;
}

export function Input({required, value, setValue, type }: Props) {
	return (
		<div className="py-2">
			<input
				className="p-2 border-black border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full"
				type={type}
				required={required}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	);
}
