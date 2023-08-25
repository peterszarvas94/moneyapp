import Link from 'next/link';
import { IoArrowForwardCircle } from 'react-icons/io5';

interface Props {
	url: string;
	text: string;
}

export default function ForwardButton({ url, text }: Props) {
	return (
		<Link
			className="flex items-center gap-1 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg w-fit"
			href={url}
		>
			<IoArrowForwardCircle />
			<div>{text}</div>
		</Link>
	)
}
