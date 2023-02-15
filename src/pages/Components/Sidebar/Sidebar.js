// Changer couleur hover menu link

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { signIn, signOut, useSession, getSession } from "next-auth/react";

import logoWhite from "../../../../public/assets/logos/logo-publicly-so-white.svg";
import userPicture from "../../../../public/assets/gabriel.png";
import dotsMenuVertical from "../../../../public/assets/icons/3-dots-menu-icon.svg";
import myProductsIcon from "../../../../public/assets/icons/my-products-icon.svg";
import helpCenterIcon from "../../../../public/assets/icons/help-center-icon.svg";

export default function Sidebar() {
  const [menuOpened, setMenuOpened] = useState(false);

  const openMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const router = useRouter();
  const currentRoute = router.pathname;
  const { data: session, status } = useSession();

  return (
    <nav className={styles.sidenav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.logo_wrapper}>
              <div className="logo_link">
                <Image src={logoWhite} alt="Logo svg publicly.so white"></Image>
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
                <p>My products</p>
              </Link>
              <Link href="/products" className={styles.mainMenuLink}>
                <Image
                  src={helpCenterIcon}
                  className={styles.menuIcon}
                  width={22}
                />
                <p>Help Center</p>
              </Link>
            </div>
          </div>
          {session ? (
            <div className={styles.bottom}>
              <div className={styles.user}>
                <Image
                  //src={userPicture}
                  src={session.user.image}
                  width={50}
                  height={50}
                  alt="User profile picture"
                  className={styles.userPicture}
                />
                <div className={styles.userInfos}>
                  <div className={styles.userName}>{session.user.name}</div>
                  <div className={styles.userSlug}>@gabschemoul</div>
                </div>
              </div>
              <div className={styles.menu}>
                <div
                  className={styles.dotsMenuWrapper}
                  onClick={() => openMenu()}
                >
                  <Image
                    src={dotsMenuVertical}
                    alt=""
                    width={3}
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
