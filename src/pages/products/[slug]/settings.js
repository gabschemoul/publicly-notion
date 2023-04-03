import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getSession } from "next-auth/react";

import {
  query,
  where,
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import styles from "@/styles/ProductSettings.module.css";

import ProductNav from "@/Components/ProductNav/ProductNav";

export default function settings({ product }) {
  const [newProduct, setNewProduct] = useState(product);
  const [newIcon, setNewIcon] = useState(product.icon);
  const [validSlug, setValidSlug] = useState(true);
  const storage = getStorage();

  const uploadRef = useRef();
  const iconRef = useRef();
  const deletePopupRef = useRef();
  const slugRef = useRef();
  const errorSlugRef = useRef();
  const submitRef = useRef();
  const errorCharSlugRef = useRef();

  const router = useRouter();

  const handleChange = (e) => {
    setNewProduct((prev) => {
      const key = e.target.name;
      const value = e.target.value;
      return { ...prev, [key]: value };
    });
  };

  const handleSlugChange = (e) => {
    if (
      e.target.value.match("^[a-z0-9]+(?:-[a-z0-9]+)*$") ||
      e.target.value.length === 0
    ) {
      errorCharSlugRef.current.style.display = "none";
      setValidSlug(true);
    } else {
      errorCharSlugRef.current.style.display = "block";
      setValidSlug(false);
      setNewProduct((prev) => {
        const key = e.target.name;
        const value = e.target.value;
        return { ...prev, [key]: value };
      });
      return false;
    }

    if (e.target.value.length === 0) {
      setValidSlug(false);
      setNewProduct((prev) => {
        const key = e.target.name;
        const value = e.target.value;
        return { ...prev, [key]: value };
      });
      return false;
    }

    setNewProduct((prev) => {
      const key = e.target.name;
      const value = e.target.value;
      return { ...prev, [key]: value };
    });

    let docSnap;

    (async () => {
      const productsInstance = collection(db, "products");

      const productRef = query(
        productsInstance,
        where("slug", "==", e.target.value)
      );
      docSnap = await getDocs(productRef);
    })().then(() => {
      if (docSnap.empty || e.target.value === product.slug) {
        errorSlugRef.current.style.display = "none";
        setValidSlug(true);
      } else {
        errorSlugRef.current.style.display = "block";
        setValidSlug(false);
      }
    });
  };

  useEffect(() => {
    if (validSlug) {
      submitRef.current.disabled = false;
      submitRef.current.style.opacity = "100%";
      submitRef.current.style.cursor = "pointer";
    } else {
      submitRef.current.disabled = true;
      submitRef.current.style.opacity = "30%";
      submitRef.current.style.cursor = "not-allowed";
    }
  }, [validSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Modification du product
    const productInstance = doc(db, "products", product.id);

    const docRef = await setDoc(productInstance, newProduct);

    // Redirection
    router.push(`/products/${newProduct.slug}/settings`);
  };

  const submitUpload = (e) => {
    setNewIcon(e.target.files[0]);
  };

  const handleClickLogo = (e) => {
    uploadRef.current.click();
  };

  useEffect(() => {
    handleUpload();
  }, [newIcon]);

  useEffect(() => {
    iconRef.current.style.backgroundImage = "url(" + newProduct.icon + ")";
  }, [newProduct.icon]);

  const handleUpload = () => {
    if (newIcon.name !== undefined) {
      const storageRef = ref(storage, `/files/${newIcon.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newIcon);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewProduct((prev) => {
              return { ...prev, icon: downloadURL };
            });
          });
        }
      );
    }
  };

  const showDeletePopup = () => {
    deletePopupRef.current.style.display = "flex";
  };

  const hideDeletePopup = () => {
    deletePopupRef.current.style.display = "none";
  };

  const deleteProduct = async () => {
    /* Old code that delete the product completely
    const users = product.makersId;

    users.forEach(async (user) => {
      const userInstance = doc(db, "users", user);
      const userSnap = await getDoc(userInstance);
      const userData = userSnap.data();
      const userProductsId = userData.productsId;

      let newProductsArray = [];

      userProductsId.forEach((productId) => {
        if (product.id !== productId) {
          newProductsArray.push(productId);
        }
      });

      const newUser = {
        ...userData,
        productsId: newProductsArray,
      };

      await setDoc(userInstance, newUser);
    });

    const productInstance = doc(db, "products", product.id);
    const docRef = await deleteDoc(productInstance);*/

    const newProduct = {
      ...product,
      active: false,
    };

    const productInstance = doc(db, "products", product.id);
    await setDoc(productInstance, newProduct);

    // Redirection
    router.push(`/products`);
  };

  return (
    <>
      <Head>
        <title>
          {product.name ? product.name : "Product not found"} - Publicly
        </title>
        <meta name="description" content="The user feedback management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.productSubContainer}>
        <ProductNav product={product} />
        <div className={styles.container}>
          <h1 className={styles.subTitle}>Settings</h1>
          <div className={styles.settingsList}>
            <form action="" onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.settingsLine}>
                <label htmlFor="icon" className={styles.label}>
                  Logo
                </label>
                <div
                  className={styles.logo}
                  style={{ backgroundImage: "url(" + product.icon + ")" }}
                  ref={iconRef}
                ></div>
                <input
                  type="file"
                  name="icon"
                  id="icon"
                  onChange={submitUpload}
                  style={{ display: "none" }}
                  ref={uploadRef}
                />
                <div
                  className={styles.changeLogo}
                  onClick={() => handleClickLogo()}
                >
                  <p>{product.icon !== "" ? "Change" : "Upload"}</p>
                </div>
              </div>

              <div className={styles.settingsLine}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={newProduct.name}
                  maxLength={100}
                  className={styles.input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.settingsLine}>
                <label htmlFor="tagline" className={styles.label}>
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  id="tagline"
                  placeholder="Tagline"
                  maxLength={200}
                  value={newProduct.tagline}
                  className={styles.input}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.settingsLine}>
                <label htmlFor="slug" className={styles.label}>
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  placeholder="Slug"
                  value={newProduct.slug}
                  maxLength={100}
                  className={styles.input}
                  onChange={handleSlugChange}
                  ref={slugRef}
                  required
                />
                <p
                  className={styles.errorSlug}
                  style={{ display: "none" }}
                  ref={errorSlugRef}
                >
                  This slug is already used by another product. Choose another
                  one.
                </p>
                <p
                  className={styles.errorSlug}
                  style={{ display: "none" }}
                  ref={errorCharSlugRef}
                >
                  Invalid character.
                </p>
              </div>
              <button type="submit" ref={submitRef}>
                Save
              </button>
            </form>

            <div className={styles.dangerZone}>
              <h2>Danger zone</h2>
              <button className={styles.deleteButton} onClick={showDeletePopup}>
                Delete my product
              </button>
            </div>
            <div className={styles.deletePopup} ref={deletePopupRef}>
              <div className={styles.deletePopupCard}>
                <h2>Are you sure you want to delete {product.name}</h2>
                <div className={styles.choices}>
                  <button
                    className={styles.deleteProductButton}
                    onClick={deleteProduct}
                  >
                    Yes
                  </button>
                  <button
                    className={styles.notDeleteProductButton}
                    onClick={hideDeletePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const userInstance = doc(db, "users", session.user.id);
  const userSnap = await getDoc(userInstance);

  if (!userSnap.data()) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const slug = context.params.slug;

  const productsInstance = collection(db, "products");

  let product;

  const productRef = query(productsInstance, where("slug", "==", slug));
  const docSnap = await getDocs(productRef);
  docSnap.forEach((snap) => {
    if (snap.exists()) {
      const data = snap.data();
      product = data;
      product.id = snap.id;
    } else {
      console.log("no data");
    }
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  let isMaker = false;

  product.makersId.forEach((id) => {
    if (id === session.user.id) {
      isMaker = true;
    }
  });

  if (!isMaker) {
    return {
      redirect: {
        destination: `/products`,
        permanent: false,
      },
    };
  }

  if (!product.notion.token) {
    return {
      redirect: {
        destination: `/products/${product.slug}/connect`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
