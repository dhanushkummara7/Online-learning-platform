import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Star,
  Search,
  Code,
  Brain,
  BarChart2,
  Cloud,
  ShieldCheck,
  Palette,
  Smartphone,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';

export const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          api.getFeaturedCourses(),
          api.getCategories(),
        ]);

        if (featuredRes.success) {
          setFeaturedCourses(featuredRes.featured || []);
          setPopularCourses(featuredRes.popular || []);
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories || []);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return <Code size={24} color="#6366f1" />;
      case 'Brain': return <Brain size={24} color="#a855f7" />;
      case 'BarChart2': return <BarChart2 size={24} color="#06b6d4" />;
      case 'Cloud': return <Cloud size={24} color="#3b82f6" />;
      case 'ShieldCheck': return <ShieldCheck size={24} color="#ef4444" />;
      case 'Palette': return <Palette size={24} color="#ec4899" />;
      case 'Smartphone': return <Smartphone size={24} color="#10b981" />;
      default: return <BookOpen size={24} color="#f59e0b" />;
    }
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 4rem',
          background: 'var(--gradient-hero)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            {/* Top pill badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} /> Empowering 25,000+ Modern Tech Careers
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                marginBottom: '1.2rem',
                lineHeight: '1.15',
              }}
            >
              Master In-Demand Skills with{' '}
              <span className="gradient-text">Interactive Mastery</span>
            </h1>

            {/* Sub-headline */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
                lineHeight: '1.6',
                maxWidth: '680px',
                margin: '0 auto 2.5rem',
              }}
            >
              Learn Full-Stack Web Development, AI & LLMs, Cloud DevOps, and UI/UX Design from industry experts through project-driven video lectures, interactive quizzes, and verified certificates.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                maxWidth: '560px',
                margin: '0 auto 2.5rem',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-glass-heavy)',
                backdropFilter: 'blur(20px)',
                padding: '6px 6px 6px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <Search size={20} color="var(--text-muted)" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="What skill do you want to master today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                Search <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Filter Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                flexWrap: 'wrap',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>Popular searches:</span>
              {['React 19', 'AI & LLMs', 'Node.js', 'Figma', 'AWS & Docker'].map((tag) => (
                <Link
                  key={tag}
                  to={`/courses?search=${encodeURIComponent(tag)}`}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            {[
              { number: '50,000+', label: 'Active Learners Worldwide', icon: Users, color: '#6366f1' },
              { number: '150+', label: 'Practical Hands-on Projects', icon: BookOpen, color: '#a855f7' },
              { number: '99.4%', label: 'Learner Satisfaction Rate', icon: Star, color: '#f59e0b' },
              { number: '100%', label: 'Verifiable Certificates', icon: Award, color: '#10b981' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
                  <Icon size={28} color={stat.color} style={{ margin: '0 auto 0.6rem' }} />
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.8rem',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= EXPLORE CATEGORIES ================= */}
      <section style={{ padding: '5rem 0 3rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
                Curated Fields
              </span>
              <h2 style={{ fontSize: '2rem' }}>Explore Top Learning Categories</h2>
            </div>
            <Link to="/courses" className="btn btn-secondary btn-sm">
              View All Tracks <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.2rem',
            }}
          >
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '2px' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {cat.courseCount} Courses available
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                Staff Picks
              </span>
              <h2 style={{ fontSize: '2rem' }}>Featured & Highest Rated Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-primary btn-sm">
              Explore All Courses <ArrowRight size={15} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Loading courses...
            </div>
          ) : (
            <div className="grid-courses">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY SKILLFORGE (FEATURES) ================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
              Why Choose SkillForge
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>
              Engineered for Real-World Competence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Traditional video courses leave you with passive watching. SkillForge combines active video tracking, embedded quizzes, timestamped notes, and credential verification.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.8rem',
            }}
          >
            {[
              {
                title: 'High-Bitrate Video Lectures',
                desc: 'Smooth video player with 0.75x to 2x speed adjustment, continuous playback, and distraction-free theater mode.',
                icon: Play,
                color: '#6366f1',
              },
              {
                title: 'Interactive Assessment Quizzes',
                desc: 'Test your understanding immediately after lectures with multiple-choice quizzes and automated grading.',
                icon: Zap,
                color: '#a855f7',
              },
              {
                title: 'Timestamped Personal Notes',
                desc: 'Jot down insights while listening to lectures and click back at any time to jump to that exact second.',
                icon: BookOpen,
                color: '#06b6d4',
              },
              {
                title: 'Verifiable Digital Certificates',
                desc: 'Earn a uniquely identifiable, tamper-proof certificate upon 100% completion ready for LinkedIn & resumes.',
                icon: Award,
                color: '#10b981',
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${feat.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} color={feat.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <div
            className="glass-panel-heavy"
            style={{
              padding: '4rem 2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%), var(--bg-secondary)',
              textAlign: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
              Ready to Accelerate Your Career?
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto 2rem',
              }}
            >
              Join thousands of engineers and designers acquiring hands-on mastery. Start learning today with our 1-click demo access!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary btn-lg">
                Explore Courses Now <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Test 1-Click Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
