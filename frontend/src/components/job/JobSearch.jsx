import { Search, X } from 'lucide-react';

const JobSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="job-search-box">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by job title, skill (e.g. React, Java), or company..."
          className="job-search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="clear-search-btn"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
