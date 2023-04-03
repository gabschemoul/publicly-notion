import React from "react";
import { getSession } from "next-auth/react";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

import styles from "@/styles/Connect.module.css";

import ConnectNotionForm from "@/Components/ConnectNotionForm/ConnectNotionForm";

export default function connectProduct({ product }) {
  return (
    <>
      <ConnectNotionForm product={product} />
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

  const slug = context.params.slug;

  const productsInstance = collection(db, "products");

  let product;

  const productRef = query(productsInstance, where("slug", "==", slug));
  const docSnap = await getDocs(productRef);
  docSnap.forEach((snap) => {
    if (snap.exists()) {
      const data = snap.data();
      product = data;
    } else {
      console.log("no data");
    }
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  let isMaker = false;

  product.makersId.forEach((id) => {
    if (id === session.user.id) {
      isMaker = true;
    }
  });

  if (!isMaker) {
    return {
      redirect: {
        destination: `/products`,
        permanent: false,
      },
    };
  }

  if (product.notion.token) {
    return {
      redirect: {
        destination: `/products/${product.slug}/settings`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
