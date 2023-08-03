interface Props {
	title: string;
}
function CardTitle({ title }: Props) {
	return (
		<h2 className="uppercase tracking-wider bg-gray-100 p-2">
			{title}
		</h2>
	)
}

export default CardTitle;
