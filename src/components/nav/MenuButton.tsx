import { RiMenuUnfoldLine } from "react-icons/ri";
import { useMenuContext } from "~/context/menu";

export default function MenuButton() {
	const { open, setOpen } = useMenuContext();

	if (open) {
		return null;
	}

	return (
		<button onClick={() => setOpen(true)}>
			<RiMenuUnfoldLine className="text-2xl cursor-pointer text-white" />
		</button>
	);
}
