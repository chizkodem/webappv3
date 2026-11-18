import React, { useState } from "react";

const LazyImage = ({ src, alt = "", className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-[#fcb12d] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage;
