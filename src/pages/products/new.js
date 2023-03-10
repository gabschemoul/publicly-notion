import React from "react";
import { getSession } from "next-auth/react";

import NewProductForm from "../../Components/NewProductForm/NewProductForm";

export default function createProduct() {
  return (
    <div>
      <NewProductForm />
    </div>
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
    props: {},
  };
}
