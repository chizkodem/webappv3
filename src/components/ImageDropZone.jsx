import React from "react";
import { useState } from "react";

const ImageDropZone = ({ iconImage, setIconImage }) => {
  const handleIconImage = (e) => {
    setIconImage(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    if (type === "icon") {
      setIconImage(file);
    }
  };

  return (
    <div className="flex">
      <div
        className="w-full h-50 flex flex-col justify-center items-center"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "icon")}
      >
        {!iconImage && <p>icon img</p>}
        <input
          type="file"
          accept="image/*"
          className="border rounded-lg w-50 cursor-pointer hidden"
          onChange={handleIconImage}
        />
        <p className={` ${iconImage ? "hidden" : ""}`}>
          Drag and Drop your attachment file here
        </p>
        {iconImage && (
          <img
            src={URL.createObjectURL(iconImage)}
            alt="Gun icon preview"
            className="w-full object-contain h-full scale-250"
          />
        )}
      </div>
    </div>
  );
};

export default ImageDropZone;
