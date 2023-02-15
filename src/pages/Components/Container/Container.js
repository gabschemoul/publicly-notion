import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Space_Grotesk } from "@next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
import styles from "./Container.module.css";

export default function Container({ children }) {
  return (
    <div className={spaceGrotesk.className}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
