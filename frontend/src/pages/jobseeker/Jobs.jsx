import { useState, useMemo } from 'react';
import { getJobs } from '../../data/jobs';
import JobCard from '../../components/job/JobCard';
import JobSearch from '../../components/job/JobSearch';
import JobFilter from '../../components/job/JobFilter';
import { Briefcase, SlidersHorizontal, RotateCcw } from 'lucide-react';

const Jobs = () => {
  const [jobs] = useState(getJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    employmentTypes: [],
    experienceLevels: [],
  });

  // Dynamic filter options extracted from dataset
  const locationOptions = useMemo(() => {
    const locs = new Set(jobs.map((j) => j.location));
    return Array.from(locs).sort();
  }, [jobs]);

  const employmentTypeOptions = ['Full Time', 'Part Time', 'Internship', 'Contract'];
  const experienceLevelOptions = ['Fresher', '0–2 Years', '2–5 Years', '5+ Years'];

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      employmentTypes: [],
      experienceLevels: [],
    });
  };

  // Filter logic combining search term and multi-select filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term matching (Title, Skill, Company)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesSkill = job.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesCompany && !matchesSkill) {
          return false;
        }
      }

      // Location Filter
      if (filters.location && job.location !== filters.location) {
        return false;
      }

      // Employment Type Filter
      if (
        filters.employmentTypes.length > 0 &&
        !filters.employmentTypes.includes(job.employmentType)
      ) {
        return false;
      }

      // Experience Level Filter
      if (
        filters.experienceLevels.length > 0 &&
        !filters.experienceLevels.includes(job.experienceLevel)
      ) {
        return false;
      }

      return true;
    });
  }, [jobs, searchTerm, filters]);

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <h1>Browse Enterprise Positions</h1>
          <p className="jobs-subtitle">
            Find software engineering, data science, and cloud operations roles matching your career goals.
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="btn btn-outline mobile-filter-toggle"
        >
          <SlidersHorizontal size={16} style={{ marginRight: 6 }} />
          <span>Filters</span>
        </button>
      </div>

      <JobSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="jobs-content-grid">
        {/* Desktop / Collapsible Sidebar Filter */}
        <div className={`filter-column ${showMobileFilters ? 'mobile-visible' : ''}`}>
          <JobFilter
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            locations={locationOptions}
            employmentTypes={employmentTypeOptions}
            experienceLevels={experienceLevelOptions}
          />
        </div>

        {/* Main Job List / Cards Area */}
        <div className="jobs-list-column">
          <div className="results-meta-bar">
            <span className="results-count">
              Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> open positions
            </span>
            {(searchTerm ||
              filters.location ||
              filters.employmentTypes.length > 0 ||
              filters.experienceLevels.length > 0) && (
              <button onClick={resetFilters} className="clear-all-link">
                <RotateCcw size={13} style={{ marginRight: 4 }} />
                Clear All Filters
              </button>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="no-results-card">
              <div className="no-results-icon">
                <Briefcase size={36} />
              </div>
              <h3>No Matching Jobs Found</h3>
              <p>
                We couldn't find any positions matching your search criteria. Try adjusting your search keywords or resetting filters.
              </p>
              <button onClick={resetFilters} className="btn btn-primary mt-3">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="jobs-cards-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
