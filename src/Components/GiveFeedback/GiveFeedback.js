import React from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./GiveFeedback.module.css";

import blackThunder from "../../../public/assets/logos/blackThunder.svg";
import goldenThunder from "../../../public/assets/logos/goldenThunder.svg";

export default function GiveFeedback() {
  return (
    <Link
      href="https://publicly.so/products/publicly"
      target="_blank"
      className={styles.container}
    >
      <Image
        src={blackThunder}
        width={39}
        height={53}
        className={styles.thunder}
      />
      Give a feedback
    </Link>
  );
}
