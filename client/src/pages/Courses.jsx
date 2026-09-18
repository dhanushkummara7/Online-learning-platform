import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';

const CATEGORIES_LIST = [
  'All',
  'Web Development',
  'AI & Machine Learning',
  'Data Science',
  'Cloud & DevOps',
  'Cybersecurity',
  'UI/UX Design',
];

const LEVELS_LIST = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const PRICE_OPTIONS = [
  { label: 'All Prices', value: 'All' },
  { label: 'Free Courses', value: 'free' },
  { label: 'Paid Courses', value: 'paid' },
];

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Sync state when URL params change (e.g. from navbar or home clicks)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlLevel = searchParams.get('level') || 'All';
    const urlPriceType = searchParams.get('priceType') || 'All';
    const urlSort = searchParams.get('sort') || 'popular';

    setSearch(urlSearch);
    setCategory(urlCategory);
    setLevel(urlLevel);
    setPriceType(urlPriceType);
    setSort(urlSort);
  }, [searchParams]);

  // Fetch courses on filter change or reload
  useEffect(() => {
    let isMounted = true;

    const fetchFilteredCourses = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (level && level !== 'All') params.level = level;
        if (priceType && priceType !== 'All') params.priceType = priceType;
        if (sort) params.sort = sort;

        const res = await api.getCourses(params);
        if (!isMounted) return;

        if (res.success) {
          setCourses(res.courses || []);
          setTotalCourses(res.total || 0);
        } else {
          setErrorMessage(res.message || 'Failed to fetch courses from server.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        if (!isMounted) return;
        setErrorMessage(
          'Unable to connect to the backend server. Make sure the SkillForge server is running (npm run dev or npm run server).'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFilteredCourses();

    return () => {
      isMounted = false;
    };
  }, [search, category, level, priceType, sort, reloadTrigger]);

  // Helper to update filter & URL params
  const updateFilters = (newCategory, newLevel, newPriceType, newSort, newSearch) => {
    const nextParams = new URLSearchParams();
    const cat = newCategory !== undefined ? newCategory : category;
    const lvl = newLevel !== undefined ? newLevel : level;
    const pt = newPriceType !== undefined ? newPriceType : priceType;
    const st = newSort !== undefined ? newSort : sort;
    const sc = newSearch !== undefined ? newSearch : search;

    if (sc) nextParams.set('search', sc);
    if (cat && cat !== 'All') nextParams.set('category', cat);
    if (lvl && lvl !== 'All') nextParams.set('level', lvl);
    if (pt && pt !== 'All') nextParams.set('priceType', pt);
    if (st && st !== 'popular') nextParams.set('sort', st);

    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters(category, level, priceType, sort, search.trim());
  };

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    updateFilters(selectedCat, level, priceType, sort, search);
  };

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    updateFilters(category, selectedLevel, priceType, sort, search);
  };

  const handlePriceSelect = (selectedPrice) => {
    setPriceType(selectedPrice);
    updateFilters(category, level, selectedPrice, sort, search);
  };

  const handleSortChange = (selectedSort) => {
    setSort(selectedSort);
    updateFilters(category, level, priceType, selectedSort, search);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setPriceType('All');
    setSort('popular');
    setSearchParams({});
  };

  const handleRetry = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            Course Catalog & Curriculum
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Browse {totalCourses > 0 ? totalCourses : 'comprehensive'} industry-aligned video courses designed for career transformation.
          </p>
        </div>

        {/* Top Filter & Search Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.2rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.2rem',
          }}
        >
          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 6px 4px 14px',
              flex: '1',
              minWidth: '260px',
              maxWidth: '420px',
            }}
          >
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search by topic, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  updateFilters(category, level, priceType, sort, '');
                }}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 6px' }}
              >
                Clear
              </button>
            )}
          </form>

          {/* Sort Dropdown & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort by:</span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.875rem' }}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              title="Reset all filters"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem' }} className="catalog-grid-layout">
          {/* Desktop Filters Sidebar */}
          <aside className="desktop-filters-sidebar">
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.2rem',
                }}
              >
                <SlidersHorizontal size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>Filter Courses</h3>
              </div>

              {/* Category Filter */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
                  Categories
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: category === cat ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: category === cat ? '#818cf8' : 'var(--text-primary)',
                        fontWeight: category === cat ? '600' : '400',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s',
                        border: category === cat ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
                  Difficulty Level
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {LEVELS_LIST.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleLevelSelect(lvl)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: level === lvl ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: level === lvl ? '#818cf8' : 'var(--text-primary)',
                        fontWeight: level === lvl ? '600' : '400',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s',
                        border: level === lvl ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Type */}
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
                  Price
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {PRICE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handlePriceSelect(opt.value)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: priceType === opt.value ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: priceType === opt.value ? '#818cf8' : 'var(--text-primary)',
                        fontWeight: priceType === opt.value ? '600' : '400',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s',
                        border: priceType === opt.value ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Courses Grid Output */}
          <main>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid var(--border-subtle)',
                    borderTopColor: 'var(--brand-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem',
                  }}
                />
                <p>Loading catalog...</p>
              </div>
            ) : errorMessage ? (
              <div
                className="glass-panel"
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Server Connection Notice
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  {errorMessage}
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                  <button onClick={handleRetry} className="btn btn-primary btn-sm">
                    <RefreshCw size={15} /> Retry Connection
                  </button>
                  <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                    <RotateCcw size={15} /> Reset Filters
                  </button>
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  We couldn't find any courses matching your specific search filters. Try clearing some criteria.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  <RotateCcw size={15} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Showing <strong>{courses.length}</strong> of <strong>{totalCourses}</strong> courses
                </div>
                <div className="grid-courses">
                  {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .catalog-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
