import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { getSession, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Publicly - The best user feedback management tool</title>
        <meta name="description" content="The user feedback management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        {!(status === "authenticated") && <p>Not connected</p>}
        {status === "authenticated" && <p>Connected</p>}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/products",
      permanent: false,
    },
  };
}
