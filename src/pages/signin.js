import React, { useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { getProviders, signIn, signOut } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";

import { firebaseConfig } from "../pages/api/auth/[...nextauth]";

import Google from "../../public/assets/Signin/Google.png";
import GitHub from "../../public/assets/Signin/github.svg";
import publiclyIcon from "../../public/assets/logos/publicly-icon.svg";

//import styles from "./signin.module.css";
import styles from "@/styles/signin.module.css";
import blurWrapper from "../../public/assets/blurs/blurWrapper.png";
import Link from "next/link";

import { doc, query, getDocs, collection, where } from "@firebase/firestore";
import { db } from "@/firebase/config";

export default function SignIn({ providers, boolSignOut }) {
  useEffect(() => {
    if (boolSignOut) {
      signOut();
    }
  }, [boolSignOut]);

  return (
    <>
      <Head>
        <title>Sign in - Publicly</title>
      </Head>

      <div className={styles.container}>
        <Image src={publiclyIcon} className={styles.icon} height={70} />
        <div className={styles.signinWrapper}>
          <Image
            src={blurWrapper}
            width={412}
            height={303}
            className={styles.blurWrapper}
          />
          <h1>Welcome to Publicly</h1>
          <p className={styles.subtitle}>Sign in to get started.</p>
          <div className={styles.providersButtons}>
            {Object.values(providers).map((provider) => {
              switch (provider.id) {
                case "google":
                  return (
                    <a
                      className={styles.googleButton}
                      onClick={() => signIn(provider.id)}
                      key={provider.name}
                    >
                      <Image
                        src={Google}
                        width={30}
                        height={30}
                        alt="Google G logo"
                      />
                      <p>Sign in with {provider.name}</p>
                    </a>
                  );
                  break;
                case "github":
                  return (
                    <a
                      className={styles.githubButton}
                      onClick={() => signIn(provider.id)}
                      key={provider.name}
                    >
                      <Image
                        src={GitHub}
                        width={30}
                        height={30}
                        alt="GitHub logo"
                      />
                      <p>Sign in with {provider.name}</p>
                    </a>
                  );
                  break;
                default:
                  console.log("Default");
              }
            })}
          </div>
          <p className={styles.request}>
            Need another option?
            <br />
            Request it{" "}
            {
              <Link
                href="https://publicly.so/products/publicly/features"
                target="_blank"
              >
                here
              </Link>
            }
            .
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    firebaseConfig
  );

  let boolSignOut = false;

  if (session) {
    const usersInstance = collection(db, "users");
    let user;

    const userRef = query(
      usersInstance,
      where("email", "==", session.user.email)
    );
    const userSnap = await getDocs(userRef);
    userSnap.forEach((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        user = data;
        user.id = snap.id;
      }
    });

    if (user) {
      console.log("user");
      return { redirect: { destination: "/products" } };
    } else {
      boolSignOut = true;
      console.log("no user");
    }
  }

  const providers = await getProviders(context);

  return {
    props: { providers: Object.values(providers) ?? [], boolSignOut },
  };
}
