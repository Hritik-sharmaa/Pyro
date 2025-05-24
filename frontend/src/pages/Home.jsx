import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeLoader from "../skeletonLoader/HomeLoader";


const GameSlider = lazy(() => import("../components/GameSlider"));
const TopRatedGames = lazy(() => import("../components/TopRatedGames"));
const FlashSale = lazy(() => import("../components/FlashSale"));
const Banner = lazy(() => import("../components/Banner"));
const BrowseByGenre = lazy(() => import("../components/BrowseByGenre"));
const UnderPrice = lazy(() => import("../components/UnderPrice"));

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  return (
    <div className="">
      <div className="">
        {isLoading ? (
          <HomeLoader />
        ) : (
          <div>
            <Toaster
              position="top-right"
              toastOptions={{ duration: 3000 }}
              className="z-[999]"
            />
            <Navbar />

            <Suspense fallback={<Loading />}>
              <GameSlider />
              <TopRatedGames />
              <BrowseByGenre />
              <FlashSale />
              <Banner />
              <UnderPrice />
            </Suspense>

            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
