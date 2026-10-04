import { Link } from 'react-router-dom';
import {
  FiInstagram, FiTwitter, FiFacebook, FiYoutube,
  FiMail, FiPhone, FiMapPin, FiArrowRight,
} from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys'];

const SHOP_LINKS = [
  ['All Products',    '/products'],
  ['Featured Deals',  '/products?sort=rating'],
  ['New Arrivals',    '/products?sort=newest'],
  ['My Orders',       '/orders'],
  ['My Wishlist',     '/wishlist'],
];

const SOCIAL = [
  { Icon: FiInstagram, label: 'Instagram' },
  { Icon: FiTwitter,   label: 'Twitter'   },
  { Icon: FiFacebook,  label: 'Facebook'  },
  { Icon: FiYoutube,   label: 'YouTube'   },
];

const LEGAL = ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'];

/* ── Reusable sub-components ─────────────────────────────────────── */

const ColHeading = ({ children }) => (
  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
    <span className="inline-block w-4 h-px bg-primary-500 rounded-full" />
    {children}
  </h3>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
    >
      <FiArrowRight
        size={11}
        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary-500"
      />
      {children}
    </Link>
  </li>
);

/* ── Main Footer ─────────────────────────────────────────────────── */

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800/60">

    {/* ── Top accent line ── */}
    <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

    <div className="container-custom pt-14 pb-10">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40 group-hover:shadow-primary-500/30 transition-shadow duration-300">
              <span className="text-white font-bold text-sm font-display">S</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              Shop<span className="text-primary-400">Nest</span>
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
            Your premium destination for quality products across all categories.
            Shop smarter, live better.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {SOCIAL.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700/60 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white hover:scale-105 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop column */}
        <div>
          <ColHeading>Shop</ColHeading>
          <ul className="space-y-3">
            {SHOP_LINKS.map(([label, to]) => (
              <FooterLink key={label} to={to}>{label}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Categories column */}
        <div>
          <ColHeading>Categories</ColHeading>
          <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <FooterLink key={cat} to={`/products?category=${encodeURIComponent(cat)}`}>
                {cat}
              </FooterLink>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter column */}
        <div>
          <ColHeading>Contact Us</ColHeading>
          <ul className="space-y-3.5 mb-7">
            <li className="flex items-start gap-2.5 text-sm text-gray-400">
              <span className="mt-0.5 w-6 h-6 rounded-lg bg-gray-800 border border-gray-700/60 flex items-center justify-center shrink-0">
                <FiMapPin size={12} className="text-primary-400" />
              </span>
              <span className="leading-relaxed">123 Commerce Street,<br />Mumbai, India</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-400">
              <span className="w-6 h-6 rounded-lg bg-gray-800 border border-gray-700/60 flex items-center justify-center shrink-0">
                <FiPhone size={12} className="text-primary-400" />
              </span>
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-400">
              <span className="w-6 h-6 rounded-lg bg-gray-800 border border-gray-700/60 flex items-center justify-center shrink-0">
                <FiMail size={12} className="text-primary-400" />
              </span>
              support@shopnest.in
            </li>
          </ul>

          {/* Newsletter */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Newsletter
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-3.5 py-2.5 bg-gray-800 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200"
            />
            <button className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shrink-0">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mt-12 mb-6 h-px bg-gradient-to-r from-transparent via-gray-700/80 to-transparent" />

      {/* ── Bottom bar ── */}
      <div className="flex flex-col items-center gap-4">

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LEGAL.map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 tracking-wide text-center">
          <span className="text-gray-400">© 2026 ShopNest. All Rights Reserved.</span>
          <span className="mx-2 text-gray-600">|</span>
          <span className="text-gray-500">Built with </span>
          <span className="text-base leading-none align-middle">❤️</span>
          <span className="text-primary-400/80 font-medium"> by Rohit</span>
        </p>
      </div>

    </div>
  </footer>
);

export default Footer;
