import { AiFillSave } from "react-icons/ai";

interface Props {
	text: string;
}

function SubmitButton({ text }: Props) {
	return (
		<div className="flex justify-center py-4">
			<button
				className="flex items-center gap-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-fit"
				type="submit"
			>
				<AiFillSave />
				<div>{text}</div>
			</button>
		</div>
	)
}

export default SubmitButton;
