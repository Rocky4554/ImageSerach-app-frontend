import { X, Loader2 } from 'lucide-react';

function SearchBar({ searchTerm, setSearchTerm, onSearch, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedTerm = searchTerm?.trim() || '';
    if (trimmedTerm) {
      onSearch(trimmedTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm || ''} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for images..."
          className="w-full px-6 py-4 pr-12 bg-gray-800 text-white rounded-xl border-2 border-amber-400 focus:border-purple-500 focus:outline-none text-lg"
          disabled={isLoading}
        />
        {searchTerm && ( 
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-32 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !searchTerm?.trim()} 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-600 text-black px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;