import { AiFillDelete } from 'react-icons/ai';

interface Props {
	click: () => void;
	text: string;
}

function EditButton({ click, text }: Props) {
	return (
		<button
			className="flex items-center gap-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-fit"
			onClick={() => click()}
		>
			<AiFillDelete />
			<div>{text}</div>
		</button>
	)
}

export default EditButton;
