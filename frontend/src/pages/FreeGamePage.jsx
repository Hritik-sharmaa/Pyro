import React from "react";
import games from "../utils/FreeGameDetails";
import Navbar from "../components/Navbar"


const FreeGamePage = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />
      <h1 className="text-5xl font-extrabold text-center text-red-500 mb-10 pt-32">
        Free Games 
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {games.map((game) => (
          <a
            key={game.id}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group block bg-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all"></div>
            <div className="absolute bottom-4 left-4">
              <h2 className="text-2xl font-bold">{game.name}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FreeGamePage;
