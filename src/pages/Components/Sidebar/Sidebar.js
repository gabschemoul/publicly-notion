// Changer couleur hover menu link

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import publiclyLogo from "../../../../public/assets/logos/publicly-icon.svg";
import userPicture from "../../../../public/assets/gabriel.png";
import dotsMenuVertical from "../../../../public/assets/icons/3-dots-menu-icon.svg";
import settingsIcon from "../../../../public/assets/icons/settingsIconV2.svg";
import myProductsIcon from "../../../../public/assets/icons/my-products-icon.svg";
import helpCenterIcon from "../../../../public/assets/icons/help-center-icon.svg";
import settings from "@/pages/products/[slug]/settings";

export default function Sidebar(props) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [products, setProducts] = useState([]);

  const openMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const router = useRouter();
  const currentRoute = router.pathname;
  const { data: session, status } = useSession();

  //let products = [];

  useEffect(() => {
    if (session) {
      setProducts(getProducts(session));
      console.log("OK");
      console.log(products);
    }
  }, [session]);

  //console.log(products.length);

  //const userInstance = doc(db, "users", userId);

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
            <Link
              href="/products"
              className={
                //currentRoute === "/products"
                currentRoute.includes("/products") ||
                currentRoute.includes("/bugs")
                  ? styles.mainMenuLinkActive
                  : styles.mainMenuLink
              }
            >
              <Image
                src={myProductsIcon}
                className={styles.menuIcon}
                width={22}
              />
            </Link>
          </div>
          {session ? (
            <div className={styles.bottom}>
              <div className={styles.user}>
                <Image
                  //src={userPicture}
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
                  <Image
                    src={settingsIcon}
                    alt=""
                    width={18}
                    className={styles.sidenavMenuIcon}
                  />
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

async function getProducts(session) {
  const userInstance = doc(db, "users", session.user.id);
  const userSnap = await getDoc(userInstance);
  const productsId = userSnap.data().productsId;

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

  console.log("products");
  console.log(products);

  return JSON.parse(JSON.stringify(products));
}

/*
<Link
              href="/products"
              className={
                //currentRoute === "/products"
                currentRoute.includes("/products") ||
                currentRoute.includes("/bugs")
                  ? styles.mainMenuLinkActive
                  : styles.mainMenuLink
              }
            >
              <Image
                src={myProductsIcon}
                className={styles.menuIcon}
                width={22}
              />
            </Link>
*/
