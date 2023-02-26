import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { useSession, getSession } from "next-auth/react";

import styles from "./NewProductForm.module.css";
import plusIcon from "../../../../public/assets/icons/plusIcon.svg";

export default function NewProductForm(props) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    tagline: "",
    slug: "",
    icon: "",
    bugs: [],
    active: true,
  });

  const { data: session, status } = useSession();

  const router = useRouter();
  /*
  (async () => {
    if (session) {

      const userInstance = doc(db, "users", session.user.id);
      const userSnap = await getDoc(userInstance);
      const userProductsId = userSnap.data().productsId;

      console.log("userProductsId");
      console.log(userSnap.data());
    }
  })();*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Création d'un nouveau product
    const colInstance = collection(db, "products");

    const fullProduct = {
      ...newProduct,
      makersId: [session.user.id],
      creationDate: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(colInstance, fullProduct);

    // Ajout du product au user
    const userInstance = doc(db, "users", session.user.id);
    const userSnap = await getDoc(userInstance);
    const user = userSnap.data();
    const userProductsId = user.productsId;

    const newProductsArray = [...userProductsId, docRef.id];

    const newUser = {
      ...user,
      productsId: newProductsArray,
    };

    await setDoc(userInstance, newUser);

    // Redirection
    router.push("/products");
    //router.push(`/products/${newProduct.slug}`);
  };

  const [newFile, setNewFile] = useState({});
  const uploadRef = useRef();
  const storage = getStorage();

  const handleChange = (e) => {
    setNewProduct((prev) => {
      const key = e.target.name;
      const value = e.target.value;
      return { ...prev, [key]: value };
    });
  };

  const submitUpload = (e) => {
    setNewFile(e.target.files[0]);
  };

  useEffect(() => {
    handleUpload();
  }, [newFile]);

  const handleUpload = () => {
    if (newFile !== undefined) {
      const storageRef = ref(storage, `/files/${newFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newFile);

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
            setUploadedIcon(downloadURL);
            //console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  const handleClick = (e) => {
    uploadRef.current.click();
  };

  const nameInputRef = useRef();

  useEffect(() => {
    nameInputRef.current.focus();
    uploadedIconWrapperRef.current.style.display = "none";
  }, []);

  const [validSlug, setValidSlug] = useState(false);
  const slugRef = useRef();
  const errorSlugRef = useRef();
  const errorCharSlugRef = useRef();

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
      if (docSnap.empty) {
        errorSlugRef.current.style.display = "none";
        setValidSlug(true);
      } else {
        errorSlugRef.current.style.display = "block";
        setValidSlug(false);
      }
    });
  };

  const submitRef = useRef();

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

  const [uploadedIcon, setUploadedIcon] = useState("");
  const uploadedIconRef = useRef();
  const uploadedIconWrapperRef = useRef();
  const uploadIconRef = useRef();
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    uploadedIconRef.current.style.backgroundImage = "url(" + uploadedIcon + ")";
    console.log("uploadedIcon");
    console.log(uploadedIcon);
    if (uploadedIcon.includes("undefined") && uploadedIcon.length !== 0) {
      uploadIconRef.current.style.display = "flex";
      uploadedIconWrapperRef.current.style.display = "none";
    } else {
      if (firstLoad) {
        setFirstLoad(false);
      } else {
        uploadIconRef.current.style.display = "none";
        uploadedIconWrapperRef.current.style.display = "flex";
      }
    }
  }, [uploadedIcon]);

  return (
    <>
      <Head>
        <title>Create a new product - Publicly</title>
        <meta name="description" content="The user feedback management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
        <h1>Create a new product</h1>
        <form action="" onSubmit={handleSubmit} className={styles.form}>
          <input
            type="file"
            name="icon"
            id="icon"
            onChange={submitUpload}
            style={{ display: "none" }}
            ref={uploadRef}
          />
          <div
            className={styles.iconUpload}
            onClick={() => handleClick()}
            ref={uploadIconRef}
          >
            <Image src={plusIcon} width={16} height={16} />
            <p>Upload your product logo</p>
          </div>
          <div
            className={styles.uploadedIconWrapper}
            ref={uploadedIconWrapperRef}
          >
            <div
              className={styles.uploadedIcon}
              style={{ backgroundImage: "url(" + uploadedIcon + ")" }}
              ref={uploadedIconRef}
            ></div>
            <button
              className={styles.changeIconButton}
              onClick={() => handleClick()}
            >
              Change
            </button>
          </div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            maxLength={100}
            value={newProduct.name}
            onChange={handleChange}
            ref={nameInputRef}
            required
          />
          <input
            type="text"
            id="tagline"
            name="tagline"
            placeholder="Tagline"
            maxLength={200}
            value={newProduct.tagline}
            onChange={handleChange}
          />
          <input
            type="text"
            id="slug"
            name="slug"
            placeholder="Slug"
            value={newProduct.slug}
            onChange={handleSlugChange}
            ref={slugRef}
            required
          />
          <p
            className={styles.errorSlug}
            style={{ display: "none" }}
            ref={errorSlugRef}
          >
            This slug is already used by another product. Choose another one.
          </p>
          <p
            className={styles.errorSlug}
            style={{ display: "none" }}
            ref={errorCharSlugRef}
          >
            Invalid character.
          </p>
          <button type="submit" className={styles.submitButton} ref={submitRef}>
            Create product
          </button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { session } = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
