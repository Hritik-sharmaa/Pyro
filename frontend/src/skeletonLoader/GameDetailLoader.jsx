import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GameDetailLoader = () => {
  return (
    <div className="p-6  bg-[#0f1115]">
      <Skeleton
        height={32}
        width="60%"
        className="mb-4"
        baseColor="#18181b"
        highlightColor="#374151"
      />

      <Skeleton
        height={320}
        className="w-full rounded-lg mb-6"
        baseColor="#18181b"
        highlightColor="#374151"
      />

      <div className="flex gap-2 mb-6">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <Skeleton
              key={index}
              height={64}
              width={96}
              className="rounded-md"
              baseColor="#18181b"
              highlightColor="#374151"
            />
          ))}
      </div>

      <Skeleton
        height={16}
        width="100%"
        className="mb-2"
        baseColor="#18181b"
        highlightColor="#374151"
      />
      <Skeleton
        height={16}
        width="100%"
        className="mb-2"
        baseColor="#18181b"
        highlightColor="#374151"
      />
      <Skeleton
        height={16}
        width="75%"
        className="mb-4"
        baseColor="#18181b"
        highlightColor="#374151"
      />

      <div className="flex gap-2 mb-6">
        <Skeleton
          height={24}
          width={80}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <Skeleton
          height={24}
          width={100}
          baseColor="#18181b"
          highlightColor="#374151"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {Array(4)
          .fill("")
          .map((_, index) => (
            <Skeleton
              key={index}
              height={24}
              width={80}
              className="rounded-md"
              baseColor="#18181b"
              highlightColor="#374151"
            />
          ))}
      </div>

      <Skeleton
        height={32}
        width="50%"
        className="mb-4"
        baseColor="#18181b"
        highlightColor="#374151"
      />
      <Skeleton
        height={128}
        className="w-full rounded-lg mb-6"
        baseColor="#18181b"
        highlightColor="#374151"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton
          height={40}
          width={100}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <Skeleton
          height={40}
          width={100}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <Skeleton
          height={40}
          width={100}
          baseColor="#18181b"
          highlightColor="#374151"
        />
      </div>
    </div>
  );
};

export default GameDetailLoader;
