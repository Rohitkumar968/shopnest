import { Link } from 'react-router-dom';
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUpRight,
  FiHeart,
  FiSend,
} from 'react-icons/fi';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
];

const SHOP_LINKS = [
  ['All Products', '/products'],
  ['Featured Deals', '/products?sort=rating'],
  ['New Arrivals', '/products?sort=newest'],
  ['My Orders', '/orders'],
  ['My Wishlist', '/wishlist'],
];

const SOCIAL_LINKS = [
  {
    Icon: FiGithub,
    label: 'GitHub',
    href: 'https://github.com/Rohitkumar968',
  },
  {
    Icon: FiLinkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rohitkumar58',
  },
  {
    Icon: FiInstagram,
    label: 'Instagram',
    href: '#',
  },
  {
    Icon: FiTwitter,
    label: 'Twitter',
    href: '#',
  },
];

const ColHeading = ({ children }) => (
  <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-300">
    <span className="h-px w-5 bg-primary-500" />
    {children}
  </h3>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-all duration-200 hover:translate-x-1 hover:text-primary-400"
    >
      <FiArrowUpRight
        size={12}
        className="opacity-0 -translate-x-1 text-primary-500 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-gray-800/70 bg-[#09090b] text-gray-300">

      {/* Premium top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="container-custom relative py-14">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="group mb-5 inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-900/30 transition-transform duration-300 group-hover:scale-105">
                <span className="font-display text-lg font-extrabold text-white">
                  S
                </span>
              </div>

              <div>
                <div className="font-display text-2xl font-extrabold tracking-tight text-white">
                  Shop<span className="text-primary-400">Nest</span>
                </div>

                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-500">
                  Shop • Discover • Enjoy
                </p>
              </div>
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-7 text-gray-400">
              Your modern destination for quality products, great deals,
              and a seamless online shopping experience.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/50 hover:bg-primary-500 hover:text-white hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <ColHeading>Shop</ColHeading>

            <ul className="space-y-3.5">
              {SHOP_LINKS.map(([label, to]) => (
                <FooterLink key={label} to={to}>
                  {label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <ColHeading>Categories</ColHeading>

            <ul className="space-y-3.5">
              {CATEGORIES.map((category) => (
                <FooterLink
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColHeading>Get In Touch</ColHeading>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
                  <FiMapPin className="text-primary-400" size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
                  <FiMail className="text-primary-400" size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </p>

                  <a
                    href="mailto:support@shopnest.in"
                    className="mt-1 block text-sm text-gray-400 transition-colors hover:text-primary-400"
                  >
                    support@shopnest.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
                  <FiPhone className="text-primary-400" size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Support
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Online Support
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/90 to-gray-900/40 p-5 sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10">
                  <FiSend className="text-primary-400" size={14} />
                </span>

                <h3 className="font-semibold text-white">
                  Stay in the loop
                </h3>
              </div>

              <p className="mt-1 pl-10 text-sm text-gray-500">
                Get updates about new products and exclusive deals.
              </p>
            </div>

            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/10"
              />

              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
              >
                Subscribe
              </button>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">

          <p className="text-xs text-gray-500">
            © {currentYear} ShopNest. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500">
            <a href="#" className="transition-colors hover:text-gray-300">
              Privacy Policy
            </a>

            <a href="#" className="transition-colors hover:text-gray-300">
              Terms & Conditions
            </a>

            <a href="#" className="transition-colors hover:text-gray-300">
              Cookie Policy
            </a>
          </div>

          {/* Developer credit */}
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            Made with
            <FiHeart
              size={13}
              className="fill-primary-500 text-primary-500"
            />
            by
            <a
              href="https://rohitkumar0-portfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-400 transition-colors hover:text-primary-300"
            >
              Rohit Kumar
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;