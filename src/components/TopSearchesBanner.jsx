import { Star } from 'lucide-react';

function TopSearchesBanner({ searches, onSearchClick }) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-sky-700 rounded-xl p-6 mb-8">
      <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
        <Star className="w-6 h-6" fill="currentColor" />
        Top Searches Across All Users
      </h2>
      <div className="flex flex-wrap gap-3">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(search.term)}
            className="bg-stone-200 bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white border-opacity-20 hover:bg-white hover:bg-opacity-20 transition-all cursor-pointer"
          >
            <span className="text-black font-semibold">{search.term}</span>
            <span className="ml-2 text-purple-900">({search.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TopSearchesBanner;