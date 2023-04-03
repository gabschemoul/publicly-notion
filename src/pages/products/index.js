import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import ProductCard from "../../Components/ProductCard/ProductCard";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

import styles from "./index.module.css";
import plusIcon from "../../../public/assets/icons/plus-icon.svg";

import { getSession } from "next-auth/react";

export default function index({ products }) {
  return (
    <>
      <Head>
        <title>My products - Publicly</title>
        <meta name="description" content="The user feedback management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        <h1>My products</h1>
        <div className={styles.list}>
          {products &&
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                tagline={product.tagline}
                icon={product.icon}
              />
            ))}
          <Link href="/products/new" className={styles.newProductCard}>
            <Image src={plusIcon} width={20} height={20} alt="" />
            <p>New product</p>
          </Link>
        </div>
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
  const userInstance = doc(db, "users", session.user.id);
  const userSnap = await getDoc(userInstance);

  if (!userSnap.data()) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const productsId = userSnap.data().productsId;

  if (!productsId.length) {
    return {
      redirect: {
        destination: "/products/new",
        permanent: false,
      },
    };
  }

  let products = [];

  await Promise.all(
    productsId.map(async (productId) => {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      const newProduct = productSnap.data();
      if (newProduct.active) {
        newProduct.id = productId;
        products.push(newProduct);
      }
    })
  );

  const docs = JSON.parse(JSON.stringify(products));

  return {
    props: {
      products: docs,
      session,
    },
  };
}
