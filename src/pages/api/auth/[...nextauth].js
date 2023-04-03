import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import jwt from "jsonwebtoken";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import { sendEmailToNewUser } from "@/utils/email";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/products`;
    },
  },
  events: {
    async createUser({ user }) {
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
      await setDoc(userInstance, newUser).then(() => {
        sendEmailToNewUser(user.email);
      });
    },
  },
  pages: {
    // new user
    signIn: "/signin",
  },
});
