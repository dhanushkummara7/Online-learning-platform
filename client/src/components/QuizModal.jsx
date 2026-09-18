import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const QuizModal = ({ courseId, lesson, isOpen, onClose, onQuizCompleted }) => {
  const { addToast } = useToast();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !lesson || !lesson.quiz || !lesson.quiz.questions) {
    return null;
  }

  const questions = lesson.quiz.questions;

  const handleOptionSelect = (qIndex, optIndex) => {
    if (result) return; // Prevent change after grading
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleSubmit = async () => {
    // Verify all answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      addToast('Please answer all questions before submitting', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitQuiz(courseId, {
        lessonId: lesson._id,
        userAnswers: selectedAnswers,
      });

      if (res.success) {
        setResult(res);

        if (res.passed) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          addToast(`Congratulations! You passed with ${res.score}%`, 'success');
        } else {
          addToast(`You scored ${res.score}%. Passing score is ${res.passingScore}%. Try again!`, 'info');
        }

        if (onQuizCompleted) {
          onQuizCompleted(res);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit quiz', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel-heavy"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '2rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HelpCircle size={22} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{lesson.quiz.title || lesson.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {questions.length} Questions • Passing Threshold: {lesson.quiz.passingScore || 70}%
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" aria-label="Close Quiz">
            <X size={20} />
          </button>
        </div>

        {/* Results Banner if graded */}
        {result && (
          <div
            style={{
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              background: result.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${result.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {result.passed ? (
                <CheckCircle2 size={32} color="#10b981" />
              ) : (
                <XCircle size={32} color="#f43f5e" />
              )}
              <div>
                <h4 style={{ fontSize: '1.1rem', color: result.passed ? '#34d399' : '#fb7185' }}>
                  {result.passed ? 'Quiz Passed!' : 'Needs Improvement'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  You scored <strong>{result.score}%</strong> ({result.correctCount} / {result.totalQuestions} correct)
                </p>
              </div>
            </div>

            {!result.passed && (
              <button onClick={handleRetry} className="btn btn-secondary btn-sm">
                <RotateCcw size={15} /> Retry Quiz
              </button>
            )}
          </div>
        )}

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginBottom: '2rem' }}>
          {questions.map((q, qIdx) => {
            const feedbackItem = result ? result.feedback[qIdx] : null;

            return (
              <div
                key={qIdx}
                style={{
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                    }}
                  >
                    {qIdx + 1}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '600', flex: 1, lineHeight: '1.4' }}>
                    {q.question}
                  </h4>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    let optStyle = {
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                      border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: result ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    };

                    if (feedbackItem) {
                      if (optIdx === feedbackItem.correctAnswer) {
                        optStyle.background = 'rgba(16, 185, 129, 0.2)';
                        optStyle.borderColor = '#10b981';
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optStyle.background = 'rgba(244, 63, 94, 0.2)';
                        optStyle.borderColor = '#f43f5e';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                        style={optStyle}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--brand-primary)' : 'var(--text-muted)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on graded */}
                {feedbackItem && feedbackItem.explanation && (
                  <div
                    style={{
                      marginTop: '0.8rem',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong>Explanation:</strong> {feedbackItem.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            {result ? 'Close' : 'Cancel'}
          </button>

          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
            </button>
          ) : (
            <button onClick={onClose} className="btn btn-primary">
              Continue Learning <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
