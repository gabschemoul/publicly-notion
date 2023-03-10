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

import styles from "@/styles/Feedbacks.module.css";

import ProductNav from "@/Components/ProductNav/ProductNav";
import FeedbackCard from "@/Components/FeedbackCard/FeedbackCard";

export default function feedbacks({ product, feedbacks }) {
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
          <h1 className={styles.subTitle}>Feedback</h1>
          <div className={styles.feedbacksList}>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <Link key={feedback.id} href={`/feedbacks/${feedback.id}`}>
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                </Link>
              ))
            ) : (
              <p className={styles.noFeedbacks}>No feedback yet.</p>
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

  const feedbacksId = product.feedbacks;
  let feedbacksList = [];

  await Promise.all(
    feedbacksId.map(async (feedbackId) => {
      const feedbackRef = doc(db, "feedbacks", feedbackId);
      const feedbackSnap = await getDoc(feedbackRef);
      const newFeedback = feedbackSnap.data();
      if (newFeedback.active) {
        newFeedback.id = feedbackId;
        feedbacksList.push(newFeedback);
      }
    })
  );

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      feedbacks: JSON.parse(JSON.stringify(feedbacksList)),
    },
  };
}
