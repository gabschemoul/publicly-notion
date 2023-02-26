import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import ProductNav from "@/pages/Components/ProductNav/ProductNav";

import styles from "./index.module.css";
import closeButton from "../../../../public/assets/icons/close-white.svg";
import arrowDown from "../../../../public/assets/icons/arrow-down-white.svg";
import dotsMenuVertical from "../../../../public/assets/icons/3-dots-menu-icon.svg";

export default function index({ bug, product, bugId, productId }) {
  const attachmentsRefs = useRef([]);
  const overlaysRefs = useRef([]);
  const closeRefs = useRef([]);
  const menuRef = useRef();
  const statusWrapperRef = useRef();
  const statusNameRef = useRef();
  const deletePopupRef = useRef();

  const [attachmentOpened, setAttachmentOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(bug.status);
  const [currentBug, setCurrentBug] = useState(bug);
  const [bugMenuOpened, setBugMenuOpened] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const router = useRouter();

  const openAttachment = (index) => {
    if (!attachmentOpened) {
      overlaysRefs.current[index].style.display = "flex";
      setAttachmentOpened(true);
    }
  };

  const closeAttachment = (index) => {
    overlaysRefs.current[index].style.display = "none";
    setAttachmentOpened(false);
  };

  const statusColor = (status) => {
    console.log(status);
    switch (status) {
      case "Reported":
        console.log("ici");
        return styles.statusDot + " " + styles.reported;
        break;
      case "In progress":
        console.log("ici2");
        return styles.statusDot + " " + styles.inProgress;
        break;
      case "Resolved":
        console.log("ici3");
        return styles.statusDot + " " + styles.resolved;
        break;
      default:
        console.log("ici4");
        return styles.statusDot + " " + styles.resolved;
    }
  };

  const toggleMenu = () => {
    if (menuOpened) {
      menuRef.current.style.display = "none";
      setMenuOpened(false);
    } else {
      menuRef.current.style.display = "flex";
      setMenuOpened(true);
    }
  };

  useEffect(() => {
    statusNameRef.current.innerText = currentStatus;
    statusWrapperRef.current.className = statusColor(currentStatus);

    (async () => {
      const bugInstance = doc(db, "bugs", bugId);

      const newBug = {
        ...bug,
        status: currentStatus,
      };

      const newBugRef = await setDoc(bugInstance, newBug);
    })();
  }, [currentStatus]);

  const statusToReported = () => {
    if (currentStatus !== "Reported") {
      setCurrentBug((prev) => {
        return { ...prev, status: "Reported" };
      });
      setCurrentStatus("Reported");
    }
    toggleMenu();
  };

  const statusToInProgress = () => {
    if (currentStatus !== "In progress") {
      setCurrentBug((prev) => {
        return { ...prev, status: "In progress" };
      });
      setCurrentStatus("In progress");
    }
    toggleMenu();
  };

  const statusToResolved = () => {
    if (currentStatus !== "Resolved") {
      setCurrentBug((prev) => {
        return { ...prev, status: "Resolved" };
      });
      setCurrentStatus("Resolved");
    }
    toggleMenu();
  };

  const toggleBugMenu = () => {
    setBugMenuOpened(!bugMenuOpened);
  };

  const toggleDeletePopup = () => {
    if (deletePopupVisible) {
      deletePopupRef.current.style.display = "none";
    } else {
      deletePopupRef.current.style.display = "flex";
    }
    setDeletePopupVisible(!deletePopupVisible);
  };

  const deleteBug = async () => {
    const newBug = {
      ...bug,
      active: false,
    };

    const bugInstance = doc(db, "bugs", bugId);
    await setDoc(bugInstance, newBug);

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
            <h1 class={styles.subTitle}>{bug.title}</h1>
            <div className={styles.topRight}>
              <div className={styles.statusMenuWrapper}>
                <div className={styles.statusWrapper}>
                  <div
                    className={styles.statusButton}
                    onClick={() => toggleMenu()}
                  >
                    <div
                      ref={statusWrapperRef}
                      className={statusColor(bug.status)}
                    ></div>
                    <p ref={statusNameRef}>{bug.status}</p>
                    <Image src={arrowDown} alt="" width={8} />
                  </div>
                </div>

                <div className={styles.menu} ref={menuRef}>
                  <div
                    className={styles.statusButton}
                    onClick={() => statusToReported()}
                  >
                    <div
                      className={styles.statusDot + " " + styles.reported}
                    ></div>
                    <p>Reported</p>
                  </div>
                  <div
                    className={styles.statusButton}
                    onClick={() => statusToInProgress()}
                  >
                    <div
                      className={styles.statusDot + " " + styles.inProgress}
                    ></div>
                    <p>In progress</p>
                  </div>

                  <div
                    className={styles.statusButton}
                    onClick={() => statusToResolved()}
                  >
                    <div
                      className={styles.statusDot + " " + styles.resolved}
                    ></div>
                    <p>Resolved</p>
                  </div>
                </div>
              </div>

              <div className={styles.bugMenu}>
                <div
                  className={styles.dotsMenuWrapper}
                  onClick={() => toggleBugMenu()}
                >
                  <Image
                    src={dotsMenuVertical}
                    alt=""
                    width={3}
                    className={styles.bugMenuIcon}
                  />
                </div>
                <div
                  className={styles.bugMenuWrapper}
                  style={{ display: bugMenuOpened ? "flex" : "none" }}
                >
                  <div
                    className={styles.bugMenuItem}
                    onClick={() => toggleDeletePopup()}
                  >
                    Delete bug
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.description}>{bug.description}</p>
          <div className={styles.attachmentsSection}>
            <h2>Attachments</h2>
            <div className={styles.attachmentsWrapper}>
              {bug.attachments.map((a, i) => (
                <div
                  className={styles.attachmentWrapper}
                  style={{ backgroundImage: `url(${a})` }}
                  ref={(ref) => {
                    attachmentsRefs.current[i] = ref;
                  }}
                  onClick={() => openAttachment(i)}
                >
                  <div
                    className={styles.attachmentOverlay}
                    ref={(ref) => {
                      overlaysRefs.current[i] = ref;
                    }}
                  >
                    <Image
                      src={closeButton}
                      width={16}
                      height={16}
                      alt=""
                      className={styles.closeButton}
                      ref={(ref) => {
                        closeRefs.current[i] = ref;
                      }}
                      onClick={() => closeAttachment(i)}
                    />
                    <Image
                      src={a}
                      alt=""
                      width={2000}
                      height={2000}
                      className={styles.attachmentImage}
                    />
                    <a href={a} target="_blank">
                      Open in another tab
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.deletePopup} ref={deletePopupRef}>
            <div className={styles.deletePopupCard}>
              <h2>Are you sure you want to delete this bug?</h2>
              <div className={styles.choices}>
                <button onClick={deleteBug}>Yes</button>
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

  const docRef = doc(db, "bugs", context.params.id);
  const docSnap = await getDoc(docRef);
  const bug = docSnap.data();

  if (!bug) {
    return {
      notFound: true,
    };
  }

  const docRef2 = doc(db, "products", bug.productId);
  const docSnap2 = await getDoc(docRef2);
  const product = docSnap2.data();

  return {
    props: {
      bug: JSON.parse(JSON.stringify(bug)),
      product: JSON.parse(JSON.stringify(product)),
      bugId: context.params.id,
      productId: bug.productId,
    },
  };
}
