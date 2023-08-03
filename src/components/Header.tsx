import Logo from "./Logo";
import Nav from "./Nav";

interface Props {
  home?: boolean;
}

function Header({ home }: Props) {
  return (
    <div className="flex justify-between p-4 bg-gray-600">
      <Logo />
      <Nav home={home} />
    </div>
  );
}

export default Header;
