import React from "react";
import styles from "./ProductCard.module.css";
import Link from "next/link";

export default function ProductCard(props) {
  return (
    <div className={styles.wrapper}>
      <Link href={`/products/${props.slug}/settings`} className={styles.card}>
        <div
          className={styles.productIcon}
          style={{ backgroundImage: "url(" + props.icon + ")" }}
        ></div>
        <div className={styles.productInfos}>
          <p className={styles.name}>{props.name}</p>
          <p className={styles.tagline}>{props.tagline}</p>
        </div>
      </Link>
    </div>
  );
}
