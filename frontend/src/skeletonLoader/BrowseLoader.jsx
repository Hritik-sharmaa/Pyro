import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BrowseLoader = () => {
  return (
    <div className="p-4 bg-[#0f1115] min-h-screen">
      <div className="mt-6 mb-4">
        <Skeleton
          baseColor="#18181b"
          highlightColor="#374151"
          height={30}
          width={200}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <Skeleton
                baseColor="#18181b"
                highlightColor="#374151"
                height={150}
              />
              <div className="mt-4">
                <Skeleton
                  baseColor="#18181b"
                  highlightColor="#374151"
                  height={20}
                  width="80%"
                />
                <Skeleton
                  baseColor="#18181b"
                  highlightColor="#374151"
                  height={15}
                  width="60%"
                />
                <Skeleton
                  baseColor="#18181b"
                  highlightColor="#374151"
                  height={15}
                  width="50%"
                />
                <Skeleton
                  baseColor="#18181b"
                  highlightColor="#374151"
                  height={30}
                  width={100}
                  className="mt-2"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-6">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton
              key={index}
              baseColor="#18181b"
              highlightColor="#374151"
              height={30}
              width={30}
              className="mx-1 rounded"
            />
          ))}
      </div>
    </div>
  );
};

export default BrowseLoader;
