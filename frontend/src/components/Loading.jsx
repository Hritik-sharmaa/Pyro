import React, { useEffect, useState } from "react";

const Loading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll("img");
      const promises = Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          })
      );

      return Promise.all(promises);
    };

    const loadPage = async () => {
      await Promise.all([
        checkImagesLoaded(),
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]);
      setIsLoading(false);
    };

    loadPage();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1115]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        <p className="text-white text-xl ml-4">Loading...</p>
      </div>
    );
  }

  return null;
};

export default Loading;
