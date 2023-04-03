import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./ConnectNotionForm.module.css";

import notionIcon from "../../../public/assets/Signin/Notion.png";
import blurWrapper from "../../../public/assets/blurs/blurWrapper.png";

export default function ConnectNotionForm({ product }) {
  const notionRef = useRef();

  const notionMouseEnter = () => {
    //notionRef.current.style.transform = "translate(0px, -3px)";
    notionRef.current.style.transform = "scale(1.2)";
  };
  const notionMouseLeave = () => {
    //notionRef.current.style.transform = "translate(0px, 0px)";
    notionRef.current.style.transform = "scale(1)";
  };

  return (
    <div className={styles.container}>
      <Image
        src={blurWrapper}
        width={412}
        height={303}
        className={styles.blurWrapper}
      />
      <p className={styles.surHeading}>Step 2 of 2</p>
      <h1>Connect your Notion Workspace</h1>
      <div className={styles.card}>
        <div className={styles.instructions}>
          <h4>Instructions</h4>
          <ol>
            <li>Click on the button below.</li>
            <li>
              Follow our{" "}
              <Link
                href="https://gabschemoul.notion.site/Connect-your-Notion-Workspace-be0c08401d844acb8b927611d50065dc"
                target="_blank"
                className={styles.link}
              >
                guidelines
              </Link>
              .
            </li>
            <li>You're done!</li>
          </ol>
        </div>
        <a
          href={`https://api.notion.com/v1/oauth/authorize?client_id=6318eded-4be8-4036-ac38-f78538464722&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.publicly.so%2Fauth%2Fnotion%2Fcallback&state=${product.slug}`}
          class={styles.button}
          onMouseEnter={() => notionMouseEnter()}
          onMouseLeave={() => notionMouseLeave()}
        >
          <p>Login with Notion</p>
          <Image
            src={notionIcon}
            width={20}
            height={20}
            ref={notionRef}
            className={styles.notionIcon}
          />
        </a>
      </div>
    </div>
  );
}
