import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { addToCart } from '../../slices/cartSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import formatPrice from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const id            = product._id;
  const name          = product.name || product.title || 'Product';
  const price         = product.price || 0;
  const discountPrice = product.discountPrice || 0;
  const effectivePrice = discountPrice > 0 ? discountPrice : price;
  const image         = product.images?.[0]?.url || product.thumbnail || 'https://placehold.co/400x400?text=No+Image';
  const stock         = product.stock ?? 50;
  const ratings       = product.ratings || product.rating || 0;
  const numReviews    = product.numReviews || product.reviews?.length || 0;
  const featured      = product.featured || false;
  const discount      = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stock === 0) return toast.error('Out of stock');
    dispatch(addToCart({ product: id, name, price: effectivePrice, image, stock }));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to add to wishlist');
    try {
      const res = await api.post(`/users/wishlist/${id}`);
      toast.success(res.data.added ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link to={`/products/${id}`} className="product-card group flex flex-col h-full">
      {/* Image area */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-dark-bg" style={{ paddingBottom: '75%' }}>
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {stock === 0 && (
            <span className="badge bg-red-500 text-white text-xs">Out of Stock</span>
          )}
          {discount > 0 && (
            <span className="badge bg-green-500 text-white text-xs">{discount}% OFF</span>
          )}
          {featured && stock > 0 && (
            <span className="badge bg-primary-500 text-white text-xs">Featured</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-dark-surface rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Add to wishlist"
        >
          <FiHeart size={14} />
        </button>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 p-3">
        {/* Category */}
        <p className="text-xs text-primary-500 dark:text-primary-400 font-medium uppercase tracking-wide mb-1 truncate">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 leading-snug mb-2 flex-1">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                size={11}
                className={star <= Math.round(ratings) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                style={{ fill: star <= Math.round(ratings) ? 'currentColor' : 'none' }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {ratings > 0 ? ratings.toFixed(1) : '—'}
            {numReviews > 0 && <span className="ml-1">({numReviews})</span>}
          </span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-dark-border">
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-white leading-none">
              {formatPrice(effectivePrice)}
            </p>
            {discount > 0 && (
              <p className="text-xs text-gray-400 line-through mt-0.5">{formatPrice(price)}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            title="Add to cart"
          >
            <FiShoppingCart size={13} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {stock > 0 && stock <= 5 && (
          <p className="text-xs text-amber-500 font-medium mt-1.5">Only {stock} left!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
