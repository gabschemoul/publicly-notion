import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

import {
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const firebaseConfig = {
  apiKey: "AIzaSyADm8WkBXG0258zXOfM3lVFdtL__JM97po",
  authDomain: "publicly-app.firebaseapp.com",
  projectId: "publicly-app",
  storageBucket: "publicly-app.appspot.com",
  messagingSenderId: "139920072271",
  appId: "1:139920072271:web:dc29de077e2c7e9c7a543a",
  measurementId: "G-8Z4LDT58XT",
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter(firebaseConfig),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  useSecureCookies: false, // using false while local development
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    //secret: process.env.NEXTAUTH_SECRET,
    async session({ session, token, user }) {
      const secret = process.env.NEXTAUTH_SECRET;
      const encodedToken = jwt.sign(token, secret, { algorithm: "HS256" });
      session.user.id = token.id;
      session.accessToken = encodedToken;
      return Promise.resolve(session);
    },
    async jwt({ token, account, user, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }

      return token;
    },
  },
  events: {
    createUser({ user }) {
      /* Mettre une image par défaut
      if(!user.image) {
        user.image = 
      }*/
      const newUser = {
        ...user,
        productsId: [],
        role: "maker",
      };

      const userInstance = doc(db, "users", user.id);
      setDoc(userInstance, newUser);
    },
  },
  pages: {
    // new user
    signIn: "/signin",
  },
});
