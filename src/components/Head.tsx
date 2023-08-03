import Head from "next/head";

interface Props {
  title: string;
  description: string;
}

function HeadElement({ title, description }: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default HeadElement;
