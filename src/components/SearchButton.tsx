import { FaSearch } from "react-icons/fa";

interface Props {
	text: string;
}

function SearchButton({ text }: Props) {
	return (
		<div className="flex justify-center py-4">
			<button
				className="flex items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-fit"
				type="submit"
			>
				<FaSearch />
				<div>{text}</div>
			</button>
		</div>
	)
}

export default SearchButton;
