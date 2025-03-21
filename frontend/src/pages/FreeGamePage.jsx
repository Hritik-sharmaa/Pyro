import games from "../utils/FreeGameDetails"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaGamepad, FaExternalLinkAlt } from "react-icons/fa"

const FreeGamePage = () => {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      <Navbar />

      {/* Improved Header Section */}
      <div className="pt-32 pb-16 mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600">
                Free Games Collection
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-red-500 rounded-full"></div>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover amazing free-to-play games that you can enjoy right now without spending a penny.
            </p>

            
          </div>
        </div>
      </div>

   

      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {games.map((game) => (
            <a
              key={game.id}
              href={game.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full bg-[#1e2128] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-red-500/30"
            >
              <div className="relative overflow-hidden">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2128] via-[#1e2128]/70 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-red-500 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <FaExternalLinkAlt className="text-white text-xl" />
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Free
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">{game.name}</h2>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {game.description ||
                    "Experience this amazing free game with stunning graphics and engaging gameplay."}
                </p>

                <div className="mt-auto flex justify-between items-center">
                  <div className="flex space-x-2">
                    {(game.tags || ["Action", "Adventure"]).slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs bg-[#282c36] px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                    
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

     

      <Footer />
    </div>
  )
}

export default FreeGamePage

