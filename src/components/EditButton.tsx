import Link from 'next/link';
import { AiFillEdit } from 'react-icons/ai';

interface Props {
	url: string;
	text: string;
}

function EditButton({ url, text }: Props) {
	return (
		<Link
			className="flex items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-fit"
			href={url}
		>
			<AiFillEdit />
			<div>{text}</div>
		</Link>
	)
}

export default EditButton;
