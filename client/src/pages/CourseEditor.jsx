import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Video,
  HelpCircle,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CourseEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  // Course Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');
  const [previewVideo, setPreviewVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(['Master core concepts', 'Build full-stack applications']);
  const [requirements, setRequirements] = useState(['Basic computer knowledge']);

  // Syllabus Modules
  const [modules, setModules] = useState([
    {
      title: 'Module 1: Introduction & Setup',
      description: 'Getting started and environment configuration',
      order: 1,
      lessons: [
        {
          title: 'Course Overview & Tools',
          type: 'video',
          duration: '10:00',
          durationSeconds: 600,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          content: 'Overview of the tools and packages needed for this course.',
          isFreePreview: true,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (isEditing) {
      const loadCourse = async () => {
        try {
          const res = await api.getInstructorCourseById(id);
          if (res.success && res.course) {
            const c = res.course;
            setTitle(c.title || '');
            setSubtitle(c.subtitle || '');
            setDescription(c.description || '');
            setCategory(c.category || 'Web Development');
            setLevel(c.level || 'Beginner');
            setPrice(c.price || 0);
            setThumbnail(c.thumbnail || '');
            setPreviewVideo(c.previewVideo || '');
            setWhatYouWillLearn(c.whatYouWillLearn?.length ? c.whatYouWillLearn : ['Master core concepts']);
            setRequirements(c.requirements?.length ? c.requirements : ['Basic computer knowledge']);
            if (c.modules?.length) setModules(c.modules);
          }
        } catch (err) {
          addToast(err.message || 'Failed to load course', 'error');
        } finally {
          setIsLoading(false);
        }
      };

      loadCourse();
    }
  }, [id, isEditing, addToast]);

  // Module actions
  const handleAddModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: New Topic`,
        description: '',
        order: prev.length + 1,
        lessons: [
          {
            title: 'New Lesson Lecture',
            type: 'video',
            duration: '10:00',
            durationSeconds: 600,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content: '',
            isFreePreview: false,
          },
        ],
      },
    ]);
  };

  const handleRemoveModule = (mIdx) => {
    setModules((prev) => prev.filter((_, i) => i !== mIdx));
  };

  const handleModuleTitleChange = (mIdx, val) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].title = val;
      return copy;
    });
  };

  // Lesson actions
  const handleAddLesson = (mIdx, type = 'video') => {
    setModules((prev) => {
      const copy = [...prev];
      const newLesson = {
        title: type === 'quiz' ? 'Module Assessment Quiz' : 'New Video Lecture',
        type,
        duration: type === 'quiz' ? '10:00' : '12:00',
        durationSeconds: 720,
        videoUrl: type === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : '',
        content: '',
        isFreePreview: false,
        quiz:
          type === 'quiz'
            ? {
                title: 'Assessment Quiz',
                passingScore: 70,
                questions: [
                  {
                    question: 'What is the key advantage of this concept?',
                    options: ['High scalability', 'Lower latency', 'Type safety', 'All of the above'],
                    correctAnswer: 3,
                    explanation: 'All options are valid benefits of this architecture.',
                  },
                ],
              }
            : undefined,
      };
      copy[mIdx].lessons.push(newLesson);
      return copy;
    });
  };

  const handleRemoveLesson = (mIdx, lIdx) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].lessons = copy[mIdx].lessons.filter((_, i) => i !== lIdx);
      return copy;
    });
  };

  const handleLessonFieldChange = (mIdx, lIdx, field, val) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[mIdx].lessons[lIdx][field] = val;
      return copy;
    });
  };

  // Quiz Question actions
  const handleAddQuizQuestion = (mIdx, lIdx) => {
    setModules((prev) => {
      const copy = [...prev];
      const lesson = copy[mIdx].lessons[lIdx];
      if (!lesson.quiz) lesson.quiz = { title: 'Assessment Quiz', passingScore: 70, questions: [] };
      lesson.quiz.questions.push({
        question: 'New Multiple-Choice Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'Option A is correct.',
      });
      return copy;
    });
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();

    if (!title.trim() || !subtitle.trim() || !description.trim()) {
      addToast('Please fill in title, subtitle, and description', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      level,
      price: Number(price),
      thumbnail,
      previewVideo,
      modules,
      whatYouWillLearn: whatYouWillLearn.filter((i) => i.trim() !== ''),
      requirements: requirements.filter((i) => i.trim() !== ''),
    };

    try {
      setIsSaving(true);
      if (isEditing) {
        const res = await api.updateCourse(id, payload);
        if (res.success) {
          addToast('Course updated successfully!', 'success');
          navigate('/instructor');
        }
      } else {
        const res = await api.createCourse(payload);
        if (res.success) {
          addToast('Course created and published!', 'success');
          navigate('/instructor');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save course', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-secondary)' }}>
        Loading course studio...
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/instructor" className="btn-icon">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ fontSize: '2rem' }}>
                {isEditing ? 'Course Editor Studio' : 'Create a New Course'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Design curriculum syllabus, configure video lessons, and create quizzes.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveCourse}
            disabled={isSaving}
            className="btn btn-primary btn-lg"
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save & Publish Course'}
          </button>
        </div>

        <form onSubmit={handleSaveCourse}>
          {/* Section 1: Basic Information */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--brand-primary)" /> 1. Course Overview & Metadata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-two-col">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Full-Stack Web Development Bootcamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Subtitle / Hook *</label>
                <input
                  type="text"
                  placeholder="e.g. Master React, Node.js, Express, and MongoDB by building 10 production projects."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹ INR, 0 for Free)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Course Description *</label>
                <textarea
                  placeholder="Write a thorough summary of what students will achieve in this course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '120px' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Syllabus & Lesson Builder */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--brand-primary)" /> 2. Syllabus, Lessons & Quizzes
              </h3>
              <button
                type="button"
                onClick={handleAddModule}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} /> Add New Module
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {modules.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                      Module {mIdx + 1}:
                    </span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                      className="form-input"
                      style={{ flex: 1, fontWeight: '600' }}
                    />
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(mIdx)}
                        className="btn-icon"
                        title="Delete Module"
                      >
                        <Trash2 size={16} color="#f43f5e" />
                      </button>
                    )}
                  </div>

                  {/* Lessons list inside module */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '1rem' }}>
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          padding: '1.2rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                          {lesson.type === 'quiz' ? (
                            <HelpCircle size={18} color="#a855f7" />
                          ) : (
                            <Video size={18} color="#6366f1" />
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Lesson {lIdx + 1}:</span>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'title', e.target.value)}
                            className="form-input"
                            style={{ flex: 1 }}
                            placeholder="Lesson Title"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(mIdx, lIdx)}
                            className="btn-icon"
                            title="Delete Lesson"
                          >
                            <Trash2 size={14} color="#f43f5e" />
                          </button>
                        </div>

                        {lesson.type === 'video' ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: '0.8rem', alignItems: 'center' }}>
                            <input
                              type="url"
                              placeholder="Video MP4 / Stream URL"
                              value={lesson.videoUrl}
                              onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                              className="form-input"
                              style={{ fontSize: '0.85rem' }}
                            />
                            <input
                              type="text"
                              placeholder="12:30"
                              value={lesson.duration}
                              onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'duration', e.target.value)}
                              className="form-input"
                              style={{ fontSize: '0.85rem' }}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={lesson.isFreePreview}
                                onChange={(e) => handleLessonFieldChange(mIdx, lIdx, 'isFreePreview', e.target.checked)}
                              />
                              Free Preview
                            </label>
                          </div>
                        ) : (
                          /* Quiz Editor */
                          <div style={{ padding: '0.8rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                Quiz Questions ({lesson.quiz?.questions?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddQuizQuestion(mIdx, lIdx)}
                                className="btn btn-secondary btn-sm"
                              >
                                <Plus size={14} /> Add Question
                              </button>
                            </div>

                            {(lesson.quiz?.questions || []).map((q, qIdx) => (
                              <div key={qIdx} style={{ marginBottom: '0.8rem', padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '4px' }}>
                                  Q{qIdx + 1}: {q.question}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Correct Option Index: {q.correctAnswer} ({q.options[q.correctAnswer]})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx, 'video')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus size={14} /> Add Video Lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx, 'quiz')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus size={14} /> Add Quiz Lesson
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Learning Outcomes */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} color="#10b981" /> 3. What Students Will Learn
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {whatYouWillLearn.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const copy = [...whatYouWillLearn];
                      copy[idx] = e.target.value;
                      setWhatYouWillLearn(copy);
                    }}
                    className="form-input"
                    placeholder="e.g. Build responsive React web apps"
                  />
                  {whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setWhatYouWillLearn((p) => p.filter((_, i) => i !== idx))}
                      className="btn-icon"
                    >
                      <Trash2 size={16} color="#f43f5e" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setWhatYouWillLearn((p) => [...p, ''])}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: '0.4rem' }}
              >
                <Plus size={14} /> Add Learning Outcome
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/instructor" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-lg"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save & Publish Course'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
