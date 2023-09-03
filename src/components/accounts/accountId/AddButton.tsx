import { BsPlusCircleFill } from 'react-icons/bs';

interface Props {
  text: string;
  onClick: () => void;
}

function AddButton({ text, onClick }: Props) {
  return (
    <button
      className="flex items-center gap-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-fit"
      onClick={() => onClick()}
    >
      <BsPlusCircleFill />
      <div>{text}</div>
    </button>
  )
}

export default AddButton;
