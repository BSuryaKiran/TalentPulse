import { Filter, RotateCcw, MapPin, Briefcase, Award } from 'lucide-react';

const JobFilter = ({
  filters,
  setFilters,
  resetFilters,
  locations = [],
  employmentTypes = [],
  experienceLevels = [],
}) => {
  const handleLocationChange = (e) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleEmploymentTypeChange = (type) => {
    setFilters((prev) => {
      const exists = prev.employmentTypes.includes(type);
      const updated = exists
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type];
      return { ...prev, employmentTypes: updated };
    });
  };

  const handleExperienceLevelChange = (level) => {
    setFilters((prev) => {
      const exists = prev.experienceLevels.includes(level);
      const updated = exists
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...prev.experienceLevels, level];
      return { ...prev, experienceLevels: updated };
    });
  };

  const hasActiveFilters =
    filters.location !== '' ||
    filters.employmentTypes.length > 0 ||
    filters.experienceLevels.length > 0;

  return (
    <div className="job-filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Jobs</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="btn-reset-filters" title="Reset all filters">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div className="filter-group">
        <label className="filter-group-title">
          <MapPin size={15} />
          <span>Location</span>
        </label>
        <select
          value={filters.location}
          onChange={handleLocationChange}
          className="filter-select"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Employment Type Filter */}
      <div className="filter-group">
        <label className="filter-group-title">
          <Briefcase size={15} />
          <span>Employment Type</span>
        </label>
        <div className="filter-checkbox-group">
          {employmentTypes.map((type) => {
            const isChecked = filters.employmentTypes.includes(type);
            return (
              <label key={type} className={`filter-checkbox-label ${isChecked ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleEmploymentTypeChange(type)}
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="filter-group">
        <label className="filter-group-title">
          <Award size={15} />
          <span>Experience Level</span>
        </label>
        <div className="filter-checkbox-group">
          {experienceLevels.map((level) => {
            const isChecked = filters.experienceLevels.includes(level);
            return (
              <label key={level} className={`filter-checkbox-label ${isChecked ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleExperienceLevelChange(level)}
                />
                <span>{level}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
