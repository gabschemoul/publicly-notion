import React from "react";

import styles from "./BugCard.module.css";

export default function BugCard(props) {
  var dateFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short" /*
    hour: "2-digit",
    minute: "2-digit",*/,
  }).format(
    new Date(
      props.bug.creationDate.seconds * 1000 +
        props.bug.creationDate.nanoseconds / 1000000
    )
  );

  const bug = props.bug;

  const statusColor = (status) => {
    switch (status) {
      case "Reported":
        return styles.statusDot + " " + styles.reported;
        break;
      case "In progress":
        return styles.statusDot + " " + styles.inProgress;
        break;
      case "Resolved":
        return styles.statusDot + " " + styles.resolved;
        break;
      default:
        return styles.statusDot + " " + styles.resolved;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <p className={styles.title}>{bug.title}</p>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.statusWrapper}>
          <div className={styles.statusButton}>
            <div className={statusColor(bug.status)}></div>
            <p>{bug.status}</p>
          </div>
        </div>
        <p>{dateFormat}</p>
        <p>{bug.author}</p>
      </div>
    </div>
  );
}
