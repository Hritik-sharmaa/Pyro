import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WishListLoader = () => {
  return (
    <div className="flex flex-col items-center w-full space-y-4 bg-[#0f1115] pt-16">
      <div className="text-center">
        <Skeleton
          height={30}
          width={200}
          baseColor="#18181b"
          highlightColor="#374151"
        />
        <Skeleton
          height={20}
          width={300}
          baseColor="#18181b"
          highlightColor="#374151"
        />
      </div>

      <Skeleton
        height={40}
        width="50%"
        className="rounded-lg"
        baseColor="#18181b"
        highlightColor="#374151"
      />

      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className="flex w-[80%] p-4 bg-[#0d0f11] dark:bg-gray-900 rounded-lg gap-4 shadow-md">
          <Skeleton
            height={100}
            width={180}
            className="rounded-lg"
            baseColor="#18181b"
            highlightColor="#374151"
          />

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
            <div className="flex gap-2">
              <Skeleton
                height={20}
                width={80}
                baseColor="#18181b"
                highlightColor="#374151"
              />
              <Skeleton
                height={20}
                width={100}
                baseColor="#18181b"
                highlightColor="#374151"
              />
              <Skeleton
                height={20}
                width={90}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between items-end">
            <Skeleton
              height={24}
              width={70}
              baseColor="#18181b"
              highlightColor="#374151"
            />
            <div className="flex gap-2">
              <Skeleton
                height={30}
                width={100}
                baseColor="#18181b"
                highlightColor="#374151"
              />
              <Skeleton
                height={30}
                width={60}
                baseColor="#18181b"
                highlightColor="#374151"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishListLoader;
