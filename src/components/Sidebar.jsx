import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

function Sidebar({ isOpen, onClose, history, onHistoryClick }) {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredHistory = history.filter(item =>
    item.term.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

  
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 overflow-hidden flex flex-col`}
      >
    
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Search History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

     
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter history..."
            className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
          />
        </div>

      
        <div className="flex-1 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {history.length === 0 ? 'No search history yet' : 'No matches found'}
            </div>
          ) : (
            <div className="p-2">
              {filteredHistory.map((item, index) => (
                <button
                  key={`${item._id}-${index}`}
                  onClick={() => {
                    onHistoryClick(item.term);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors group mb-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
                        {item.term}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

     
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="text-gray-400 text-sm text-center">
              {history.length} search{history.length !== 1 ? 'es' : ''} total
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;