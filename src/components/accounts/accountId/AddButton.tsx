import { BsPlusCircleFill } from 'react-icons/bs';

interface Props {
  onClick: () => void;
}

function AddButton({ onClick }: Props) {
	return (
		<button
			className="flex items-center gap-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-fit"
      onClick={() => onClick()}
		>
			<BsPlusCircleFill />
			<div>New event</div>
		</button>
	)
}

export default AddButton;
