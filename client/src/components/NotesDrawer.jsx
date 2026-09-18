import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, Clock, X } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const NotesDrawer = ({
  courseId,
  currentLesson,
  currentTimestamp = 0,
  notes = [],
  isOpen,
  onClose,
  onNotesUpdated,
  onSeekTimestamp,
}) => {
  const { addToast } = useToast();
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.saveNote(courseId, {
        lessonId: currentLesson?._id || 'general',
        lessonTitle: currentLesson?.title || 'General Note',
        timestamp: Math.floor(currentTimestamp),
        text: newNoteText.trim(),
      });

      if (res.success) {
        setNewNoteText('');
        addToast('Note saved!', 'success');
        if (onNotesUpdated) {
          onNotesUpdated(res.notes);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save note', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await api.deleteNote(courseId, noteId);
      if (res.success) {
        addToast('Note deleted', 'info');
        if (onNotesUpdated) {
          onNotesUpdated(res.notes);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete note', 'error');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <StickyNote size={20} color="#6366f1" />
          <h3 style={{ fontSize: '1.1rem' }}>Lecture Notes</h3>
        </div>
        <button onClick={onClose} className="btn-icon" aria-label="Close Notes">
          <X size={20} />
        </button>
      </div>

      {/* New Note Form */}
      <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleAddNote}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Note at <strong style={{ color: 'var(--brand-primary)' }}>{formatTime(currentTimestamp)}</strong>
            </span>
          </div>
          <textarea
            placeholder="Type your notes here... (e.g. key formula, reference, reminder)"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="form-textarea"
            style={{ minHeight: '80px', fontSize: '0.875rem', marginBottom: '0.6rem' }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newNoteText.trim()}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Plus size={15} /> Save Timestamped Note
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <StickyNote size={36} style={{ margin: '0 auto 0.6rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.875rem' }}>No notes taken yet for this course.</p>
            <p style={{ fontSize: '0.775rem' }}>Notes you save while watching will appear here with clickable timestamps.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => onSeekTimestamp && onSeekTimestamp(note.timestamp)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}
                  title="Jump to video timestamp"
                >
                  <Clock size={12} /> {formatTime(note.timestamp)}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(note._id)}
                  style={{ color: 'var(--text-muted)' }}
                  className="btn-icon"
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {note.text}
              </p>

              {note.lessonTitle && (
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem' }}>
                  {note.lessonTitle}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
