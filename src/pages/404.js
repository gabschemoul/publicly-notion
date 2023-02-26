import React from "react";
import Link from "next/link";

import styles from "@/styles/404.module.css";

export default function FourOhFour() {
  return (
    <div className={styles.container}>
      <h1>404 - Page not found</h1>
      <Link href="/products">Back to my products</Link>
    </div>
  );
}
