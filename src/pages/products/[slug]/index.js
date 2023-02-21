import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function index() {
  return <div></div>;
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

  const slug = context.params.slug;

  return {
    redirect: {
      destination: `/products/${slug}/bugs`,
      permanent: false,
    },
  };
}
