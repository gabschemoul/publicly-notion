import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import styles from "./ProductNav.module.css";

import feedbackIcon from "../../../public/assets/icons/starIcon.svg";
import bugIcon from "../../../public/assets/icons/bugIcon.svg";
import settingsIcon from "../../../public/assets/icons/settingsIcon.svg";
import newTabIcon from "../../../public/assets/icons/newTabIcon.svg";

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
          <div className={styles.infos}>
            <p className={styles.name}>{props.product.name}</p>
            <p className={styles.tagline}>{props.product.tagline}</p>
          </div>
        </div>
        <div className={styles.menuWrapper}>
          <Link
            href={`/products/${props.product.slug}/feedbacks`}
            className={
              //router.pathname === "/products/[slug]/bugs"
              router.pathname.includes("feedbacks")
                ? styles.activeLink
                : styles.menuLink
            }
          >
            <Image
              src={feedbackIcon}
              className={styles.menuIcon}
              width={16}
              alt=""
            />
            <p className={styles.menuLinkText}>Feedback</p>
          </Link>
          <Link
            href={`/products/${props.product.slug}/bugs`}
            className={
              //router.pathname === "/products/[slug]/bugs"
              router.pathname.includes("bugs")
                ? styles.activeLink
                : styles.menuLink
            }
          >
            <Image
              src={bugIcon}
              className={styles.menuIcon}
              width={16}
              alt=""
            />
            <p className={styles.menuLinkText}>Bugs</p>
          </Link>

          <Link
            href={`/products/${props.product.slug}/settings`}
            className={
              router.pathname === "/products/[slug]/settings"
                ? styles.activeLink
                : styles.menuLink
            }
          >
            <Image
              src={settingsIcon}
              className={styles.menuIcon}
              width={16}
              alt=""
            />
            <p className={styles.menuLinkText}>Settings</p>
          </Link>
          <Link
            href={`https://publicly.so/products/${props.product.slug}`}
            target="_blank"
            className={styles.menuLink}
          >
            <Image
              src={newTabIcon}
              className={styles.menuIcon}
              width={16}
              alt=""
            />
            <p className={styles.menuLinkText}>View Public Page</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}
