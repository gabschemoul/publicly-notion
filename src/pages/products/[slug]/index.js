import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function index({ slug }) {
  const router = useRouter();
  useEffect(() => {
    router.push(`/products/${slug}/bugs`);
  }, []);

  return <div></div>;
}

export async function getServerSideProps(context) {
  const slug = context.params.slug;

  return {
    props: {
      slug,
    },
  };
}
