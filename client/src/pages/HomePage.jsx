import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
  FiStar,
  FiShoppingBag,
  FiZap,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';

import { fetchFeaturedProducts, loadCatalog } from '../slices/productSlice';
import ProductCard from '../components/product/ProductCard';

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  {
    name: 'Electronics',
    emoji: '⚡',
    description: 'Smart gadgets',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    link: '/products?category=Electronics',
  },
  {
    name: 'Clothing',
    emoji: '👕',
    description: 'Latest fashion',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-500/10',
    link: '/products?category=Clothing',
  },
  {
    name: 'Books',
    emoji: '📚',
    description: 'Read & learn',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    link: '/products?category=Books',
  },
  {
    name: 'Sports',
    emoji: '⚽',
    description: 'Stay active',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-500/10',
    link: '/products?category=Sports',
  },
  {
    name: 'Home & Garden',
    emoji: '🏡',
    description: 'Make it yours',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    link: '/products?category=Home+%26+Garden',
  },
  {
    name: 'Beauty',
    emoji: '✨',
    description: 'Beauty essentials',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    link: '/products?category=Beauty',
  },
  {
    name: 'Toys',
    emoji: '🧸',
    description: 'Fun for everyone',
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
    link: '/products?category=Toys',
  },
];

/* =========================================================
   FEATURES
========================================================= */

const FEATURES = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    desc: 'On eligible orders',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    desc: '100% protected checkout',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    desc: 'Simple 30-day returns',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    desc: 'Always here to help',
  },
];

/* =========================================================
   SKELETON
========================================================= */

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151515] animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-gray-800" />

    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-4" />
    </div>
  </div>
);

/* =========================================================
   HOME PAGE
========================================================= */

const HomePage = () => {
  const dispatch = useDispatch();

  const { featured, catalogLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(loadCatalog()).then(() => {
      dispatch(fetchFeaturedProducts());
    });
  }, [dispatch]);

  return (
    <div className="animate-fade-in bg-gray-50/50 dark:bg-[#0b0b0b]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#0d0d0d]">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]" />

          <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-orange-400/10 blur-[120px]" />

          <div className="absolute bottom-0 left-1/2 w-[400px] h-[250px] rounded-full bg-amber-500/10 blur-[100px]" />

        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] w-24 h-24 border border-orange-500/20 rounded-full" />
        <div className="absolute bottom-20 right-[18%] w-12 h-12 border border-orange-400/20 rounded-full" />

        <div className="container-custom relative z-10">

          <div className="min-h-[560px] lg:min-h-[620px] grid lg:grid-cols-2 items-center gap-12 py-16 lg:py-20">

            {/* LEFT */}
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
                <FiZap size={15} />
                New arrivals are here
              </div>

              {/* Heading */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-white">

                Everything you need.

                <span className="block text-orange-500 mt-2">
                  All in one place.
                </span>

              </h1>

              {/* Description */}
              <p className="mt-7 max-w-xl text-gray-400 text-base sm:text-lg leading-relaxed">
                Discover premium products across electronics, fashion,
                books, sports, home essentials and more — all at prices
                you'll love.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-9">

                <Link
                  to="/products"
                  className="
                    inline-flex items-center gap-2
                    px-7 py-3.5
                    rounded-xl
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    font-bold
                    shadow-xl shadow-orange-500/20
                    transition-all duration-200
                    hover:-translate-y-1
                  "
                >
                  Shop Now
                  <FiArrowRight size={18} />
                </Link>

                <Link
                  to="/products?sort=rating"
                  className="
                    inline-flex items-center gap-2
                    px-7 py-3.5
                    rounded-xl
                    border border-gray-700
                    hover:border-orange-500
                    text-gray-200
                    hover:text-orange-400
                    font-semibold
                    transition-all duration-200
                  "
                >
                  <FiStar size={17} />
                  Explore Deals
                </Link>

              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 sm:gap-12 mt-12 pt-8 border-t border-gray-800">

                <div>
                  <p className="text-2xl font-black text-white">
                    200+
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Products
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-white">
                    10+
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Categories
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-white">
                    4.9/5
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Customer Rating
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT VISUAL */}
            <div className="hidden lg:flex justify-center items-center relative">

              <div className="relative w-[430px] h-[430px]">

                {/* Main circle */}
                <div className="
                  absolute inset-8
                  rounded-full
                  bg-gradient-to-br
                  from-orange-500
                  via-orange-400
                  to-amber-300
                  opacity-90
                  shadow-[0_0_100px_rgba(249,115,22,0.25)]
                " />

                {/* Inner circle */}
                <div className="
                  absolute inset-20
                  rounded-full
                  bg-[#161616]
                  border border-white/10
                  flex items-center justify-center
                ">

                  <div className="text-center">

                    <div className="text-7xl mb-4">
                      🛍️
                    </div>

                    <p className="text-white text-2xl font-black">
                      ShopNest
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Shop smarter. Live better.
                    </p>

                  </div>

                </div>

                {/* Floating card 1 */}
                <div className="
                  absolute
                  top-4
                  right-0
                  px-4 py-3
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-xl
                  border border-white/10
                  shadow-2xl
                ">
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                      <FiShoppingBag className="text-white" />
                    </div>

                    <div>
                      <p className="text-white text-sm font-bold">
                        Premium Shopping
                      </p>
                      <p className="text-gray-400 text-xs">
                        Everything you need
                      </p>
                    </div>

                  </div>
                </div>

                {/* Floating card 2 */}
                <div className="
                  absolute
                  bottom-10
                  left-0
                  px-4 py-3
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-xl
                  border border-white/10
                  shadow-2xl
                ">
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                      <FiCheckCircle className="text-white" />
                    </div>

                    <div>
                      <p className="text-white text-sm font-bold">
                        Secure Checkout
                      </p>
                      <p className="text-gray-400 text-xs">
                        Safe & reliable
                      </p>
                    </div>

                  </div>
                </div>

                {/* Floating star */}
                <div className="
                  absolute
                  bottom-2
                  right-8
                  w-14 h-14
                  rounded-2xl
                  bg-orange-500
                  flex items-center justify-center
                  shadow-xl shadow-orange-500/30
                  rotate-6
                ">
                  <FiStar
                    size={25}
                    className="text-white fill-white"
                  />
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-gray-800">

        <div className="container-custom">

          <div className="grid grid-cols-2 lg:grid-cols-4">

            {FEATURES.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`
                    flex items-center gap-4
                    py-6 px-4
                    lg:px-6
                    ${
                      index !== FEATURES.length - 1
                        ? 'lg:border-r border-gray-100 dark:border-gray-800'
                        : ''
                    }
                  `}
                >

                  <div className="
                    w-11 h-11
                    rounded-xl
                    bg-orange-50
                    dark:bg-orange-500/10
                    text-orange-500
                    flex items-center justify-center
                    shrink-0
                  ">
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      {feature.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {feature.desc}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="container-custom py-16">

        <div className="flex items-end justify-between mb-8">

          <div>
            <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.18em]">
              Explore
            </span>

            <h2 className="section-title mt-2">
              Shop by Category
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Find exactly what you're looking for.
            </p>
          </div>

          <Link
            to="/products"
            className="
              hidden sm:flex
              items-center gap-2
              text-orange-500
              hover:text-orange-600
              text-sm
              font-bold
            "
          >
            View All
            <FiArrowRight size={16} />
          </Link>

        </div>

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-7
          gap-4
        ">

          {CATEGORIES.map((category) => (

            <Link
              key={category.name}
              to={category.link}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border border-gray-100
                dark:border-gray-800
                bg-white
                dark:bg-[#151515]
                p-5
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:border-orange-200
                dark:hover:border-orange-500/30
              "
            >

              <div
                className={`
                  w-16 h-16
                  mx-auto
                  rounded-2xl
                  ${category.bg}
                  flex items-center justify-center
                  text-3xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                `}
              >
                {category.emoji}
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                {category.name}
              </h3>

              <p className="text-[11px] text-gray-400 mt-1">
                {category.description}
              </p>

              <div
                className={`
                  absolute
                  inset-x-0
                  bottom-0
                  h-1
                  bg-gradient-to-r
                  ${category.color}
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                `}
              />

            </Link>

          ))}

        </div>

      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="bg-white dark:bg-[#101010] border-y border-gray-100 dark:border-gray-800">

        <div className="container-custom py-16">

          <div className="flex items-end justify-between mb-8">

            <div>

              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <FiTrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Trending Now
                </span>
              </div>

              <h2 className="section-title">
                Featured Products
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Handpicked products customers love.
              </p>

            </div>

            <Link
              to="/products?sort=rating"
              className="
                hidden sm:flex
                items-center gap-2
                text-orange-500
                hover:text-orange-600
                text-sm
                font-bold
              "
            >
              View All
              <FiArrowRight size={16} />
            </Link>

          </div>

          {catalogLoading ? (

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-4
              md:gap-6
            ">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>

          ) : featured.length === 0 ? (

            <div className="
              text-center
              py-20
              rounded-2xl
              border border-dashed
              border-gray-200
              dark:border-gray-800
            ">

              <div className="
                w-16 h-16
                mx-auto
                rounded-2xl
                bg-orange-50
                dark:bg-orange-500/10
                text-orange-500
                flex items-center justify-center
              ">
                <FiShoppingBag size={26} />
              </div>

              <p className="text-lg font-bold text-gray-900 dark:text-white mt-5">
                No featured products yet
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Explore our complete collection.
              </p>

              <Link
                to="/products"
                className="
                  inline-flex items-center gap-2
                  mt-5
                  px-6 py-3
                  rounded-xl
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  text-sm
                  font-bold
                "
              >
                Browse Products
                <FiArrowRight size={16} />
              </Link>

            </div>

          ) : (

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-4
              md:gap-6
            ">

              {featured.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          DEAL BANNER
      ====================================================== */}

      <section className="container-custom py-16">

        <div className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-br
          from-orange-500
          via-orange-500
          to-amber-500
          p-8
          md:p-12
          lg:p-14
        ">

          {/* Decorative */}
          <div className="
            absolute
            -right-20
            -top-20
            w-72 h-72
            rounded-full
            bg-white/10
          " />

          <div className="
            absolute
            -right-10
            -bottom-32
            w-80 h-80
            rounded-full
            border-[40px]
            border-white/5
          " />

          <div className="relative z-10 max-w-2xl">

            <span className="
              inline-flex
              items-center gap-2
              px-3 py-1.5
              rounded-full
              bg-white/15
              text-white
              text-xs
              font-bold
              uppercase
              tracking-wider
            ">
              <FiZap size={13} />
              Limited Time Offer
            </span>

            <h2 className="
              font-display
              text-3xl
              md:text-4xl
              lg:text-5xl
              font-black
              text-white
              mt-5
            ">
              Get 20% Off Your First Order
            </h2>

            <p className="
              text-orange-50
              text-sm
              md:text-base
              mt-4
              max-w-xl
              leading-relaxed
            ">
              Join ShopNest today and discover amazing products,
              exclusive deals and a better way to shop online.
            </p>

            <div className="flex flex-wrap gap-4 mt-7">

              <Link
                to="/register"
                className="
                  inline-flex items-center gap-2
                  px-7 py-3.5
                  rounded-xl
                  bg-white
                  text-orange-600
                  font-bold
                  hover:bg-orange-50
                  transition-all
                  hover:-translate-y-0.5
                "
              >
                Create Account
                <FiArrowRight size={17} />
              </Link>

              <Link
                to="/products"
                className="
                  inline-flex items-center gap-2
                  px-7 py-3.5
                  rounded-xl
                  border
                  border-white/40
                  text-white
                  font-semibold
                  hover:bg-white/10
                  transition-all
                "
              >
                Start Shopping
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          TRUST SECTION
      ====================================================== */}

      <section className="container-custom pb-16">

        <div className="
          rounded-2xl
          border border-gray-100
          dark:border-gray-800
          bg-white
          dark:bg-[#151515]
          p-6
          md:p-8
        ">

          <div className="
            flex flex-col
            md:flex-row
            items-center
            justify-between
            gap-6
          ">

            <div className="flex items-center gap-4">

              <div className="
                w-12 h-12
                rounded-xl
                bg-green-50
                dark:bg-green-500/10
                text-green-500
                flex items-center justify-center
              ">
                <FiShield size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Shop with confidence
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Secure checkout, reliable delivery and customer support.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FiCheckCircle className="text-green-500" />
              Trusted Shopping Experience
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default HomePage;