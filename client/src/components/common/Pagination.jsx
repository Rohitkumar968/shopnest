import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    const delta = 2;
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) arr.push(i);
    if (page - delta > 2) arr.unshift('...');
    if (page + delta < pages - 1) arr.push('...');
    arr.unshift(1);
    if (pages > 1) arr.push(pages);
    return [...new Set(arr)];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-dark-border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
      >
        <FaChevronLeft className="text-sm" />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              page === p
                ? 'bg-primary-500 text-white'
                : 'border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-700 dark:text-gray-300'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-200 dark:border-dark-border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;
