import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

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

  if (!product.notion.token) {
    return {
      redirect: {
        destination: `/products/${product.slug}/connect`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/products/${slug}/settings`,
      permanent: false,
    },
  };
}
