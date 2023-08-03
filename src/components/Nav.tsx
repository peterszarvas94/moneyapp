import HomeNav from "./HomeNav";
import PageNav from "./PageNav";

interface Props {
	home?: boolean;
}

function Nav({ home }: Props) {
	return (
		<nav className="flex items-center">
			<ul className="flex gap-4 items-center">
				{home ? (
					<HomeNav />
				) : (
					<PageNav />
				)}
			</ul>
		</nav>
	);
}

export default Nav;
