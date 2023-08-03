import { UseFormRegister } from "react-hook-form";

interface Props {
	register: UseFormRegister<any>;
	name: string;
	required: boolean;
	[key: string]: any;
}

export function Input({ register, name, required, ...rest }: Props) {
	return (
		<div className="py-2">
			<input
				{...register(name, { required })}
				{...rest}
				name={name}
				id={name}
				required={required}
				className="p-2 border-black border-b-2 bg-gray-100 active:outline-none focus:outline-none w-full"
			/>
		</div>
	);
}
