import React from "react";
import Image from "next/image";
import Head from "next/head";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";

import { firebaseConfig } from "../pages/api/auth/[...nextauth]";

import Google from "../../public/assets/Signin/Google.png";
import GitHub from "../../public/assets/Signin/github.svg";
import publiclyIcon from "../../public/assets/logos/publicly-icon.svg";

//import styles from "./signin.module.css";
import styles from "@/styles/signin.module.css";

export default function SignIn({ providers }) {
  return (
    <>
      <Head>
        <title>Sign in - Publicly</title>
      </Head>

      <div className={styles.container}>
        <Image src={publiclyIcon} className={styles.icon} height={70} />
        <div className={styles.signinWrapper}>
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

  if (session) {
    return { redirect: { destination: "/products" } };
  }

  const providers = await getProviders(context);

  return {
    props: { providers: Object.values(providers) ?? [] },
  };
}
/*
export default function signup() {
  return (
    <div className={styles.container}>
      <h1>Sign up</h1>
      <form action="/" method="post">
        <input
          type="text"
          id="firstname"
          name="firstname"
          placeholder="Your firstname"
          required
        />
        <input
          type="lastname"
          id="lastname"
          name="lastname"
          placeholder="Your lastname"
          required
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email"
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Your password"
          required
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
*/
