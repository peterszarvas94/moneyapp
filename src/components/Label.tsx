interface Props {
	text: string;
	htmlFor: string;
}
function Label({ text, htmlFor }: Props) {
	return (
		<label className="uppercase tracking-wider py-2" htmlFor={htmlFor}>
			{text}
		</label>
	)
}

export default Label;
