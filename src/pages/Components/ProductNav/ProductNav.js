import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./ProductNav.module.css";

export default function ProductNav(props) {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper}>
          <div
            className={styles.icon}
            style={{ backgroundImage: "url(" + props.product.icon + ")" }}
          ></div>
          <div className={styles.name}>
            <p>{props.product.name}</p>
          </div>
        </div>
        <div className={styles.menuWrapper}>
          <Link
            href={`/products/${props.product.slug}/bugs`}
            className={
              //router.pathname === "/products/[slug]/bugs"
              router.pathname.includes("bugs")
                ? styles.activeLink
                : styles.menuLink
            }
          >
            Bugs
          </Link>
          <Link
            href={`/products/${props.product.slug}/settings`}
            className={
              router.pathname === "/products/[slug]/settings"
                ? styles.activeLink
                : styles.menuLink
            }
          >
            Settings
          </Link>
          <Link
            href={`https://publicly.so/products/${props.product.slug}`}
            className={styles.cta}
          >
            Go To Public Page
          </Link>
        </div>
      </div>
    </nav>
  );
}
