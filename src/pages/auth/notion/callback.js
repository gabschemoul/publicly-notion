import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export default function NotionCallback({ token, templateId, product }) {
  /*const router = useRouter();

  useEffect(() => {
    if (product) {
      router.push(`/products/${product.slug}/settings`);
    }
  }, []);*/

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export async function getServerSideProps(resolvedUrl) {
  const session = await getSession(resolvedUrl);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const slug = resolvedUrl.query.state;

  if (!slug) {
    return {
      redirect: {
        destination: "/products",
        permanent: false,
      },
    };
  }

  const productsInstance = collection(db, "products");

  let product;

  const productRef = query(productsInstance, where("slug", "==", slug));
  const docSnap = await getDocs(productRef);
  docSnap.forEach((snap) => {
    if (snap.exists()) {
      const data = snap.data();
      product = data;
    } else {
      console.log("no data");
    }
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  if (product.notion.databaseId) {
    return {
      redirect: {
        destination: `/products/${product.slug}/settings`,
        permanent: false,
      },
    };
  }

  const options = {
    method: "post",
    url: "https://api.notion.com/v1/oauth/token",
    auth: {
      username: process.env.NOTION_CLIENT_ID,
      password: process.env.NOTION_CLIENT_SECRET,
    },
    data: {
      grant_type: "authorization_code",
      code: resolvedUrl.query.code,
      redirect_uri: "https://app.publicly.so/auth/notion/callback",
    },
    headers: { "Content-Type": "application/json" },
  };

  const res = await axios(options);

  if (res) {
    setInfos(product, res.data.access_token, res.data.duplicated_template_id);

    return {
      redirect: {
        destination: `/products/${product.slug}/settings`,
        permanent: false,
      },
    };

    /*const notion = new Client({ auth: res.data.access_token });

    (async () => {
      const databaseId =
        res.data.duplicated_template_id;
      const response = await notion.databases.retrieve({
        database_id: databaseId,
      });
      console.log(response);
    })();*/
  }

  return {
    props: {
      token: null,
      databaseId: null,
      product: null,
    },
  };
}

export async function setInfos(product, token, databaseId) {
  const newProduct = {
    ...product,
    notion: {
      token: token,
      databaseId: databaseId,
    },
  };

  const productInstance = doc(db, "products", product.id);

  await setDoc(productInstance, newProduct);

  await fetch("https://app.publicly.so/api/logsnag", {
    method: "POST",
    body: JSON.stringify({
      channel: "connected-to-notion",
      event: "Product connected to Notion",
      description: "A user has just connected his product to his Notion!",
      tags: {
        user: product.makersId[0],
        product: product.name,
      },
    }),
  });
}
