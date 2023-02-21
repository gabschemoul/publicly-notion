import React from "react";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";

import { firebaseConfig } from "../pages/api/auth/[...nextauth]";

//import styles from "./signin.module.css";
import styles from "@/styles/signin.module.css";

export default function SignIn({ providers }) {
  return (
    <div className={styles.container}>
      <h1>Login to Publicly</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
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
