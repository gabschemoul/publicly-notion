import React from "react";

import styles from "./BugCard.module.css";

export default function BugCard(props) {
  var dateFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short" /*
    hour: "2-digit",
    minute: "2-digit",*/,
  }).format(props.creationDate);

  const bug = props.bug;

  const statusColor = (status) => {
    switch (status) {
      case "Reported":
        return styles.statusButton + " " + styles.reported;
        break;
      case "In progress":
        return styles.statusButton + " " + styles.inProgress;
        break;
      case "Resolved":
        return styles.statusButton + " " + styles.resolved;
        break;
      default:
        return styles.statusButton + " " + styles.resolved;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <p className={styles.title}>{bug.title}</p>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.statusWrapper}>
          <div className={statusColor(bug.status)}>
            <p>{bug.status}</p>
          </div>
        </div>
        <p>{dateFormat}</p>
        <p>{bug.author}</p>
      </div>
    </div>
  );
}
