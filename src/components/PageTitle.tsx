interface Props {
	title: string;
}

function PageTitle({ title }: Props) {
	return (
		<h1 className='text-3xl text-center py-6'>{title}</h1>
	)
}

export default PageTitle;
