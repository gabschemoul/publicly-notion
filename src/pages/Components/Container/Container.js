import React from "react";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Space_Grotesk } from "@next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import styles from "./Container.module.css";

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useSession, getSession } from "next-auth/react";

export default function Container({ children }) {
  const session = useSession();

  return (
    <div>
      {session.status === "authenticated" && <Sidebar />}

      <main
        className={
          session.status === "authenticated" ? styles.main : styles.mainSignin
        }
      >
        {children}
      </main>
    </div>
  );
}
