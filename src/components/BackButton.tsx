import Link from 'next/link';
import { IoArrowBackCircle } from 'react-icons/io5';

interface Props {
	url: string;
	text: string;
}

function BackButton({ url, text }: Props) {
	return (
		<Link
			className="flex items-center gap-1 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg w-fit"
			href={url}
		>
			<IoArrowBackCircle />
			<div>{text}</div>
		</Link>
	)
}

export default BackButton;
