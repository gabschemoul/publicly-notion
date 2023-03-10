import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

import styles from "@/styles/Bugs.module.css";

import ProductNav from "@/Components/ProductNav/ProductNav";
import BugCard from "@/Components/BugCard/BugCard";

export default function bugs({ product, bugs }) {
  return (
    <>
      <Head>
        <title>
          {product.name ? product.name : "Product not found"} - Publicly
        </title>
        <meta name="description" content="The user feedback management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.productSubContainer}>
        <ProductNav product={product} />
        <div className={styles.container}>
          <h1 className={styles.subTitle}>Bugs</h1>
          <div className={styles.bugsList}>
            {bugs.length > 0 ? (
              bugs.map((bug) => (
                <Link key={bug.id} href={`/bugs/${bug.id}`}>
                  <BugCard key={bug.id} bug={bug} />
                </Link>
              ))
            ) : (
              <p className={styles.noBugs}>No bugs yet.</p>
            )}
          </div>
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

  const bugsId = product.bugs;
  let bugsList = [];

  await Promise.all(
    bugsId.map(async (bugId) => {
      const bugRef = doc(db, "bugs", bugId);
      const bugSnap = await getDoc(bugRef);
      const newBug = bugSnap.data();
      if (newBug.active) {
        newBug.id = bugId;
        bugsList.push(newBug);
      }
    })
  );

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      bugs: JSON.parse(JSON.stringify(bugsList)),
    },
  };
}
