import React, { useState } from 'react';
import { User, Lock, Save, Shield, CheckCircle, Sparkles, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [isUpdating, setIsUpdating] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');

      await updateUserProfile({
        name: name.trim(),
        avatar: avatar.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        skills: skillsArray,
      });
    } catch (err) {
      // Handled in context toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res.success) {
        addToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update password', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Profile & Account Settings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal profile, biography, skills, and security credentials.
          </p>
        </div>

        {/* Profile Details Form */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user?.name}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-glass)' }}
            />
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>{user?.name}</h3>
              <span className={`badge ${user?.role === 'instructor' ? 'badge-amber' : user?.role === 'admin' ? 'badge-rose' : 'badge-indigo'}`}>
                {user?.role} Account
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Full-Stack Developer & Open Source Contributor"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Skills & Tech Stacks (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="form-input"
                  placeholder="React, Node.js, Python, Figma"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Bio / Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '100px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary"
              style={{ marginTop: '0.8rem' }}
            >
              <Save size={16} /> {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Key size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Security & Password</h3>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} className="profile-form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPass || !currentPassword || !newPassword}
              className="btn btn-secondary"
              style={{ marginTop: '0.8rem' }}
            >
              <Lock size={16} /> {isChangingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-form-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-form-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
