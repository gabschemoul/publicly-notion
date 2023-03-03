// Changer couleur hover menu link

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { signOut, useSession, getSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Tooltip } from "@nextui-org/react";

import publiclyLogo from "../../../../public/assets/logos/publicly-icon.svg";
import dotsMenuVertical from "../../../../public/assets/icons/3-dots-menu-icon.svg";
import settingsIcon from "../../../../public/assets/icons/settingsIconV2.svg";
import helpCenterIcon from "../../../../public/assets/icons/help-center-icon.svg";
import plusIcon from "../../../../public/assets/icons/plusIcon.svg";

export default function Sidebar(props) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [products, setProducts] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const openMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const router = useRouter();
  const currentRoute = router.pathname;
  const urlPath = router.asPath;
  const { data: session, status } = useSession();

  useEffect(() => {
    (async () => {
      const userInstance = doc(db, "users", session.user.id);
      const userSnap = await getDoc(userInstance);
      const productsId = userSnap.data().productsId;

      let allProducts = [];
      let allBugs = [];
      let allFeedbacks = [];

      const promiseee = await Promise.all(
        productsId.map(async (productId) => {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);
          const newProduct = productSnap.data();
          if (newProduct.active) {
            newProduct.id = productId;
            allProducts.push(newProduct);

            newProduct.bugs.map((bug) => {
              allBugs.push(bug);
            });
            newProduct.feedbacks.map((feedback) => {
              allFeedbacks.push(feedback);
            });
          }
        })
      ).then(() => {
        setProducts(allProducts);
        setBugs(allBugs);
        setFeedbacks(allFeedbacks);
      });
    })();
  }, [session]);

  return (
    <nav className={styles.sidenav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.logo_wrapper}>
              <div className="logo_link">
                <Image
                  src={publiclyLogo}
                  alt="Logo svg publicly.so white"
                ></Image>
              </div>
            </div>
          </div>
          <div className={styles.mainMenuWrapper}>
            {products.length !== 0 &&
              products.map((product) => (
                <Tooltip
                  content={product.name}
                  placement="right"
                  css={{ borderRadius: "4px" }}
                  offset={16}
                >
                  <Link
                    href={`/products/${product.slug}/bugs`}
                    className={
                      linkIsActive(product, bugs, feedbacks, urlPath)
                        ? styles.productIconLinkActive
                        : styles.productIconLink
                    }
                  >
                    <div className={styles.productIconWrapper}>
                      <Image
                        src={product.icon}
                        width={56}
                        height={56}
                        className={styles.productIcon}
                      />
                    </div>
                  </Link>
                </Tooltip>
              ))}
            <Tooltip
              content={"New product"}
              placement="right"
              css={{ borderRadius: "4px" }}
              offset={16}
            >
              <Link
                href="/products/new"
                className={styles.newProductIconWrapper}
              >
                <Image src={plusIcon} className={styles.menuIcon} width={12} />
              </Link>
            </Tooltip>
          </div>
          {session ? (
            <div className={styles.bottom}>
              <div className={styles.user}>
                <Image
                  src={session.user.image}
                  width={40}
                  height={40}
                  alt="User profile picture"
                  className={styles.userPicture}
                />
              </div>
              <div className={styles.menu}>
                <div
                  className={styles.dotsMenuWrapper}
                  onClick={() => openMenu()}
                >
                  {menuOpened ? (
                    <Image
                      src={settingsIcon}
                      alt=""
                      width={18}
                      className={styles.sidenavMenuIcon}
                    />
                  ) : (
                    <Tooltip
                      content={"Settings"}
                      placement="right"
                      css={{ borderRadius: "4px" }}
                      offset={16}
                    >
                      <Image
                        src={settingsIcon}
                        alt=""
                        width={18}
                        className={styles.sidenavMenuIcon}
                      />
                    </Tooltip>
                  )}
                </div>
                <div
                  className={styles.menuWrapper}
                  style={{ display: menuOpened ? "flex" : "none" }}
                >
                  <Link href="/" className={styles.menuItem}>
                    Biling
                  </Link>
                  <div onClick={() => signOut()} className={styles.menuItem}>
                    Logout
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => router.push("/auth/signin")}
              className={styles.signinButton}
            >
              Signin
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export async function getServerSideProps(context) {
  const { session } = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

function linkIsActive(product, bugs, feedbacks, currentRoute) {
  let activeValue = false;

  if (currentRoute.includes(`/products/${product.slug}`)) {
    activeValue = true;
  }

  bugs.map((bug) => {
    if (currentRoute.includes(`/bugs/${bug}`)) {
      activeValue = true;
    }
  });
  feedbacks.map((feedback) => {
    if (currentRoute.includes(`/feedbacks/${feedback}`)) {
      activeValue = true;
    }
  });
  return activeValue;
}

async function getProducts(session) {
  const userInstance = doc(db, "users", session.user.id);
  const userSnap = await getDoc(userInstance);
  const productsId = userSnap.data().productsId;

  let products = [];

  const promiseee = await Promise.all(
    productsId.map(async (productId) => {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      const newProduct = productSnap.data();
      if (newProduct.active) {
        newProduct.id = productId;
        products.push(newProduct);
      }
    })
  ).then(() => {
    return products;
  });
}
