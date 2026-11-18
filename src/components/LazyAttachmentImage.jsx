import React, { useEffect, useState } from "react";
import { getAttachmentImage } from "../services/attachmentImages";
import LazyImage from "./LazyImage";

const LazyAttachmentImage = ({ field, value, className }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let active = true;

    const loadImage = async () => {
      const imageURL = await getAttachmentImage(field, value);

      if (active) {
        setSrc(imageURL);
      }
    };

    loadImage();

    return () => {
      active = false;
    };
  }, [field, value]);

  if (!src) return null;

  return <LazyImage src={src} alt="" className={className} />;
};

export default LazyAttachmentImage;
