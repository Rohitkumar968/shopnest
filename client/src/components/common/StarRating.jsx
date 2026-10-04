import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, numReviews, size = 'sm', interactive = false, onRate }) => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

  const renderStar = (index) => {
    const filled = rating >= index;
    const half = !filled && rating >= index - 0.5;
    const Icon = filled ? FaStar : half ? FaStarHalfAlt : FaRegStar;
    return (
      <Icon
        key={index}
        className={`${sizes[size]} ${
          filled || half ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer hover:text-amber-400 transition-colors' : ''}`}
        onClick={() => interactive && onRate && onRate(index)}
      />
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      {numReviews !== undefined && (
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
