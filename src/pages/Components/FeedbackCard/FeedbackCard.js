import React from "react";

import styles from "./FeedbackCard.module.css";

export default function FeedbackCard(props) {
  var dateFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short" /*
    hour: "2-digit",
    minute: "2-digit",*/,
  }).format(
    new Date(
      props.feedback.creationDate.seconds * 1000 +
        props.feedback.creationDate.nanoseconds / 1000000
    )
  );

  const feedback = props.feedback;

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <p className={styles.title}>{feedback.title}</p>
      </div>
      <div className={styles.cardRight}>
        <p>{dateFormat}</p>
        <p>{feedback.author}</p>
      </div>
    </div>
  );
}
