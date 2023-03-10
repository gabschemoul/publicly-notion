import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import ProductNav from "@/Components/ProductNav/ProductNav";

import styles from "./index.module.css";
import closeButton from "../../../../public/assets/icons/close-white.svg";
import arrowDown from "../../../../public/assets/icons/arrow-down-white.svg";
import dotsMenuVertical from "../../../../public/assets/icons/3-dots-menu-icon.svg";

export default function index({ feedback, product, feedbackId, productId }) {
  const attachmentsRefs = useRef([]);
  const overlaysRefs = useRef([]);
  const closeRefs = useRef([]);
  const menuRef = useRef();
  const deletePopupRef = useRef();

  const [menuOpened, setMenuOpened] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(feedback);
  const [feedbackMenuOpened, setFeedbackMenuOpened] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const router = useRouter();

  const toggleMenu = () => {
    if (menuOpened) {
      menuRef.current.style.display = "none";
      setMenuOpened(false);
    } else {
      menuRef.current.style.display = "flex";
      setMenuOpened(true);
    }
  };

  const toggleFeedbackMenu = () => {
    setFeedbackMenuOpened(!feedbackMenuOpened);
  };

  const toggleDeletePopup = () => {
    if (deletePopupVisible) {
      deletePopupRef.current.style.display = "none";
    } else {
      deletePopupRef.current.style.display = "flex";
    }
    setDeletePopupVisible(!deletePopupVisible);
  };

  const deleteFeedback = async () => {
    const newFeedback = {
      ...feedback,
      active: false,
    };

    const feedbackInstance = doc(db, "feedbacks", feedbackId);
    await setDoc(feedbackInstance, newFeedback);

    // Redirection
    router.push(`/products/${product.slug}`);
  };

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
        <div class={styles.container}>
          <div className={styles.top}>
            <h1 class={styles.subTitle}>{feedback.title}</h1>
            <div className={styles.topRight}>
              <div className={styles.feedbackMenu}>
                <div
                  className={styles.dotsMenuWrapper}
                  onClick={() => toggleFeedbackMenu()}
                >
                  <Image
                    src={dotsMenuVertical}
                    alt=""
                    width={3}
                    className={styles.feedbackMenuIcon}
                  />
                </div>
                <div
                  className={styles.feedbackMenuWrapper}
                  style={{ display: feedbackMenuOpened ? "flex" : "none" }}
                >
                  <div
                    className={styles.feedbackMenuItem}
                    onClick={() => toggleDeletePopup()}
                  >
                    Delete feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.description}>{feedback.description}</p>

          <div className={styles.deletePopup} ref={deletePopupRef}>
            <div className={styles.deletePopupCard}>
              <h2>Are you sure you want to delete this feedback?</h2>
              <div className={styles.choices}>
                <button onClick={deleteFeedback}>Yes</button>
                <button onClick={toggleDeletePopup}>Cancel</button>
              </div>
            </div>
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

  const docRef = doc(db, "feedbacks", context.params.id);
  const docSnap = await getDoc(docRef);
  const feedback = docSnap.data();

  if (!feedback) {
    return {
      notFound: true,
    };
  }

  const docRef2 = doc(db, "products", feedback.productId);
  const docSnap2 = await getDoc(docRef2);
  const product = docSnap2.data();

  return {
    props: {
      feedback: JSON.parse(JSON.stringify(feedback)),
      product: JSON.parse(JSON.stringify(product)),
      feedbackId: context.params.id,
      productId: feedback.productId,
    },
  };
}
