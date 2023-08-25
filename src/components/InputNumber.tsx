interface Props {
	required: boolean;
	value: string;
	setValue: (value: string) => void;
	min?: number;
}

export function InputNumber({ required, value, setValue, min }: Props) {
	return (
		<div className="py-2">
			<input
				className="p-2 border-black border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full"
				type="number"
				min={min ?? 0}
				max={9007199254740991}
				step={1}
				required={required}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	);
}
