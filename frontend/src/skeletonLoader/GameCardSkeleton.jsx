import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GameCardSkeleton = () => {
  return (
    <>
    <div>
      
    </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
      </div>
      <div className="flex w-full p-4 bg-[#090a0c] dark:bg-gray-900 rounded-lg gap-4 shadow-md mb-6">
        {/* Game Image Skeleton */}
        <Skeleton
          height={120}
          width={220}
          className="rounded-lg"
          baseColor="#18181b"
          highlightColor="#374151"
        />

        {/* Game Info Skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <Skeleton
            height={24}
            width="40%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="30%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={20}
            width="50%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
          <Skeleton
            height={24}
            width="20%"
            baseColor="#18181b"
            highlightColor="#374151"
          />
        </div>
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
    </>
  );
};

export default GameCardSkeleton;
