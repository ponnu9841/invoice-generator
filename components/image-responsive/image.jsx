import React from "react";
import styles from "./image.module.scss";
import Image from "next/image";

export default function NextImage({src}) {
  debugger
  return (
    <div className={styles["image-container"]}>
      <Image src={src} fill={true} className={styles["image"]} />
    </div>
  );
}
