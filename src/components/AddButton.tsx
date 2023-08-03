import Link from 'next/link';
import { BsPlusCircleFill } from 'react-icons/bs';

interface Props {
	url: string;
	text: string;
}

function AddButton({ url, text }: Props) {
	return (
		<Link
			className="flex items-center gap-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-fit"
			href={url}
		>
			<BsPlusCircleFill />
			<div>{text}</div>
		</Link>
	)
}

export default AddButton;
