import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import TopSearchesBanner from '../components/TopSearchesBanner';
import ImageGrid from '../components/ImageGrid';
import Sidebar from '../components/Sidebar';
import { searchAPI } from '../api/client';

function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const observerTarget = useRef(null);

  const { data: topSearches } = useQuery({
    queryKey: ['topSearches'],
    queryFn: searchAPI.getTopSearches,
  });

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: searchAPI.getHistory,
  });

  const searchMutation = useMutation({
    mutationFn: ({ term, page }) => searchAPI.searchImages(term, page),
    onSuccess: (response) => {
      setSearchResults(response.data);
      setAllImages(response.data.images);
      setCurrentPage(1);
      setSelectedImages([]);
      setSearchTerm('');
      refetchHistory();
    },
    onError: (error) => {
      console.error('Search failed:', error);
      alert('Failed to search images. Please try again.');
    },
  });

  // Mutation for loading more images (infinite scroll)
  const loadMoreMutation = useMutation({
    mutationFn: ({ term, page }) => searchAPI.searchImages(term, page),
    onSuccess: (response) => {
      setAllImages(prev => [...prev, ...response.data.images]);
      setCurrentPage(response.data.currentPage);
      setSearchResults(prev => ({
        ...prev,
        currentPage: response.data.currentPage,
      }));
    },
  });

  // Check if there are more pages to load
  const hasMore = searchResults ? currentPage < searchResults.totalPages : false;

  // Optimized intersection observer callback
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (
      target.isIntersecting && 
      hasMore && 
      !loadMoreMutation.isPending && 
      searchResults?.term
    ) {
      loadMoreMutation.mutate({
        term: searchResults.term,
        page: currentPage + 1
      });
    }
  }, [hasMore, loadMoreMutation.isPending, searchResults?.term, currentPage]);

  // Infinite scroll observer with cleanup
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
      rootMargin: '100px' // Start loading before reaching the bottom
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver]);

  // Memoized handlers
  const handleSearch = useCallback((term) => {
    searchMutation.mutate({ term, page: 1 });
  }, []);

  const toggleImageSelection = useCallback((imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  }, []);

  const handleTopSearchClick = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleHistorySearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar onToggleSidebar={handleToggleSidebar} />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        history={history?.data || []}
        onHistoryClick={handleHistorySearch}
      />

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TopSearchesBanner 
            searches={topSearches?.data || []} 
            onSearchClick={handleTopSearchClick}
          />
          
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            isLoading={searchMutation.isPending}
          />

          {searchResults && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  You searched for "{searchResults.term}" - {searchResults.total} results
                </h2>
                {selectedImages.length > 0 && (
                  <div className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold">
                    Selected: {selectedImages.length} images
                  </div>
                )}
              </div>

              <ImageGrid
                images={allImages}
                selectedImages={selectedImages}
                onToggleSelection={toggleImageSelection}
              />

              {/* Loading indicator for infinite scroll */}
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8">
                  {loadMoreMutation.isPending && (
                    <div className="flex items-center gap-2 text-white">
                      <Loader2 className="animate-spin h-6 w-6" />
                      <span>Loading more images...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && allImages.length > 0 && (
                <div className="flex justify-center py-8">
                  <div className="text-gray-400 text-lg">
                    No more images to load
                  </div>
                </div>
              )}
            </div>
          )}

          {!searchResults && (
            <div className="text-center mt-20">
              <div className="text-gray-400 text-xl">
                Start searching for beautiful images
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;