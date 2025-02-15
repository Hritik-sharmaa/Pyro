import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeLoader = () => {
  return (
    <div className="p-4 bg-[#0f1115]">
      <div className="h-16 bg-zinc-800 flex items-center px-4">
        <Skeleton
          height={30}
          width={120}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <div className="ml-auto flex gap-4">
          <Skeleton
            height={30}
            width={80}
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={30}
            width={80}
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>

      <div className="my-4">
        <Skeleton height={400} baseColor="#18181b" highlightColor="#374151" />
      </div>

      <div className="my-6">
        <Skeleton
          height={30}
          width={150}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                height={180}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            ))}
        </div>
      </div>

      <div className="my-6">
        <Skeleton
          height={30}
          width={200}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                height={50}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            ))}
        </div>
      </div>

      <div className="my-6">
        <Skeleton
          height={30}
          width={120}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                height={150}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            ))}
        </div>
      </div>

      <div className="my-6">
        <Skeleton
          height={30}
          width={220}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <Skeleton
          height={200}
          className="mt-4"
          baseColor="#18181b"
          highlightColor="#374151"
        />
      </div>

      <div className="my-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                height={100}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;
