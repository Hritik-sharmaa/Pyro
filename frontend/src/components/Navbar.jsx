import "../styles/Common.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IoIosHeartEmpty } from "react-icons/io"
import { CiSearch } from "react-icons/ci"
import { IoCartOutline } from "react-icons/io5"
import { useAuthStore } from "../store/authStore"
import { RiArrowDropDownLine } from "react-icons/ri"
import { FiUser, FiMenu, FiX } from "react-icons/fi"
import axios from "axios"

const Navbar = () => {
  const { user, isAuthenticated, checkAuth, logout, wishlistCount } = useAuthStore((state) => state)
  const [searchVisible, setSearchVisible] = useState(false)
  const [scrollingDown, setScrollingDown] = useState(false)
  const [active, setActive] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSearch = () => {
    setSearchVisible(!searchVisible)
    setActive(!active)
    setSearchQuery("")
    setSuggestions([])
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/games/search`, { params: { q: query } })
      setSuggestions(response.data.games || [])
    } catch (error) {
      console.error("Error fetching search suggestions:", error)
    }
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const delayDebounce = setTimeout(() => {
        fetchSuggestions(searchQuery)
      }, 300)
      return () => clearTimeout(delayDebounce)
    } else {
      setSuggestions([])
    }
  }, [searchQuery, fetchSuggestions])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      localStorage.setItem("token", token)
    }
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollingDown(true)
      } else {
        setScrollingDown(false)
      }
      lastScrollY = window.scrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    // Close mobile menu when navigating
    setMobileMenuOpen(false)
    // Close dropdown when navigating
    setShowDropdown(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <nav
        className={`flex items-center justify-between w-full h-[80px] bg-black/40 backdrop-blur-md px-4 md:px-8 lg:px-20 text-white fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrollingDown ? "-translate-y-full" : "translate-y-0"
        } border-b border-zinc-800/50`}
      >
        <div className="flex items-center gap-4 md:gap-10">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-[#FF4438] logo">
              Pyro
            </h1>
          </Link>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-lg font-medium">
            <NavItem to="/" isActive={isActive("/")}>
              Home
            </NavItem>
            <NavItem to="/browse-games" isActive={isActive("/browse-games")}>
              Browse
            </NavItem>
            <NavItem to="/about-us" isActive={isActive("/about-us")}>
              About Us
            </NavItem>
            <NavItem to="/free-games" isActive={isActive("/free-games")}>
              Play Games
            </NavItem>
          </ul>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
    
          <motion.button
            onClick={toggleSearch}
            className={`relative p-2 rounded-full ${active ? "text-[#DCFF1E] bg-zinc-800/50" : "hover:bg-zinc-800/30"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CiSearch size={24} />
          </motion.button>

         
          <AnimatePresence>
            {searchVisible && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "20rem" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[80px] right-0 md:right-[20rem] w-full md:w-[20rem] bg-black/95 border-t border-zinc-800 p-4 z-50"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[85%] bg-zinc-900/80 border border-zinc-700 outline-none p-3 pl-5 rounded-xl text-white focus:border-[#DCFF1E] transition-colors"
                    autoFocus
                  />
                  <button className="absolute right-3 top-3 text-zinc-500 hover:text-white" onClick={toggleSearch}>
                    <FiX size={20} />
                  </button>
                </div>

                {suggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-zinc-900/95 border border-zinc-800 z-50 mt-2 rounded-xl shadow-lg max-h-[60vh] overflow-y-auto"
                  >
                    {suggestions.map((game) => (
                      <Link to={`/games/${game._id}`} key={game._id}>
                        <li className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3 transition-colors border-b border-zinc-800/50 last:border-none">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={game.poster || "/placeholder.svg"}
                              alt={game.name}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{game.name}</span>
                            {game.price && <span className="text-sm text-[#DCFF1E]">₹{game.price}</span>}
                          </div>
                        </li>
                      </Link>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>

         
          <motion.button
            className="relative p-2 rounded-full hover:bg-zinc-800/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart">
              <IoCartOutline size={24} />
            </Link>
          </motion.button>

         
          <motion.button
            className="relative p-2 rounded-full hover:bg-zinc-800/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/wishlist" className="relative">
              <IoIosHeartEmpty size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FF4438] to-[#FF7F50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </motion.button>

        
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <motion.div
                className="flex items-center gap-1 text-base font-medium cursor-pointer bg-zinc-900/70 hover:bg-zinc-800 px-4 py-2 rounded-xl transition-colors"
                onClick={handleDropdownToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiUser className="text-[#DCFF1E] mr-1" />
                <span className="text-[#DCFF1E]">{user?.firstName || "Guest"}</span>
                <RiArrowDropDownLine
                  size={20}
                  className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                />
              </motion.div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="absolute top-12 right-0 w-48 bg-zinc-900/95 border border-zinc-800 rounded-xl overflow-hidden shadow-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/profile">
                      <div className="px-4 py-3 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2">
                        <FiUser size={16} />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <div className="px-4 py-3 border-t border-zinc-800">
                      <button
                        className="w-full text-center text-black bg-gradient-to-r from-[#DCFF1E] to-[#B8D91B] font-bold p-2 rounded-lg hover:brightness-110 transition-all"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block bg-gradient-to-r from-[#DCFF1E] to-[#B8D91B] text-black font-semibold px-5 py-2 rounded-xl hover:brightness-110 transition-all"
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>
          )}

          <motion.button
            className="md:hidden p-2 rounded-full hover:bg-zinc-800/30"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </nav>

    
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[80px] left-0 right-0 bg-black/95 backdrop-blur-md z-40 border-b border-zinc-800/50"
          >
            <div className="flex flex-col p-4">
              <ul className="flex flex-col gap-4 mb-6">
                <MobileNavItem to="/" isActive={isActive("/")}>
                  Home
                </MobileNavItem>
                <MobileNavItem to="/browse-games" isActive={isActive("/browse-games")}>
                  Browse
                </MobileNavItem>
                <MobileNavItem to="/about-us" isActive={isActive("/about-us")}>
                  About Us
                </MobileNavItem>
                <MobileNavItem to="/free-games" isActive={isActive("/free-games")}>
                  Play Games
                </MobileNavItem>
              </ul>

              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/profile" className="w-full">
                    <div className="flex items-center gap-2 p-3 bg-zinc-900/70 rounded-xl">
                      <FiUser className="text-[#DCFF1E]" />
                      <span>Profile ({user?.firstName || "Guest"})</span>
                    </div>
                  </Link>
                  <button
                    className="w-full text-center text-black bg-gradient-to-r from-[#DCFF1E] to-[#B8D91B] font-bold p-3 rounded-xl"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="w-full text-center text-black bg-gradient-to-r from-[#DCFF1E] to-[#B8D91B] font-bold p-3 rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Desktop Navigation Item
const NavItem = ({ children, to, isActive }) => (
  <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
    <Link
      to={to}
      className={`transition-colors duration-300 ${
        isActive ? "font-bold text-white" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </Link>
  </motion.li>
)

// Mobile Navigation Item
const MobileNavItem = ({ children, to, isActive }) => (
  <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className={`block p-3 rounded-xl transition-colors ${
        isActive ? "bg-zinc-800 font-bold border-l-4 border-[#FF4438]" : "hover:bg-zinc-900/50"
      }`}
    >
      {children}
    </Link>
  </motion.li>
)

export default Navbar

