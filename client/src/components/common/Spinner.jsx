const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' };
  const colors = { primary: 'border-primary-500', white: 'border-white', gray: 'border-gray-400' };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-t-transparent ${colors[color]}`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

export default Spinner;
