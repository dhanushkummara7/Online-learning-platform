import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Search,
  Printer,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CertificateVerify = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [searchId, setSearchId] = useState(id || '');
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const fetchCertificate = async (certId) => {
    if (!certId || !certId.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getCertificate(certId.trim());
      if (res.success && res.certificate) {
        setCertificate(res.certificate);
      } else {
        setError('Certificate not found. Please double-check the credential ID.');
        setCertificate(null);
      }
    } catch (err) {
      setError(err.message || 'Invalid certificate ID or record not found.');
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchCertificate(id);
    }
  }, [id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchCertificate(searchId.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Certificate verification link copied to clipboard!', 'success');
    }
  };

  const formattedDate = certificate?.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div style={{ padding: '3.5rem 0 6rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="no-print">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#facc15',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={16} /> SkillForge Credential Registry
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>
            Verify Certificate of Completion
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
            Enter a unique certificate credential ID below to instantly verify authentic course completion and skill accreditation.
          </p>
        </div>

        {/* Lookup Search Box */}
        <div className="no-print" style={{ marginBottom: '3rem' }}>
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel-heavy"
            style={{
              padding: '0.6rem 0.8rem 0.6rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="e.g. CERT-SKILLFORGE-2026-UX99"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }}
            />
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
              {isLoading ? 'Verifying...' : 'Verify ID'}
            </button>
          </form>

          {/* Quick Demo Certificate Suggestion */}
          {!certificate && (
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Try demo credential:{' '}
              <button
                type="button"
                onClick={() => {
                  setSearchId('CERT-SKILLFORGE-2026-UX99');
                  fetchCertificate('CERT-SKILLFORGE-2026-UX99');
                }}
                style={{
                  color: 'var(--brand-primary)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                CERT-SKILLFORGE-2026-UX99
              </button>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--brand-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p>Querying verified credential ledger...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              background: 'rgba(244, 63, 94, 0.05)',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <AlertCircle size={36} color="#f43f5e" style={{ margin: '0 auto 0.8rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#f43f5e' }}>Verification Failed</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              {error}
            </p>
          </div>
        )}

        {/* Verified Certificate Result */}
        {certificate && !isLoading && (
          <div>
            {/* Status Banner */}
            <div
              className="glass-panel no-print"
              style={{
                padding: '1.2rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                background: 'rgba(16, 185, 129, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CheckCircle size={24} color="#10b981" />
                <div>
                  <div style={{ fontWeight: '700', color: '#10b981', fontSize: '0.95rem' }}>
                    Authentic Verified Credential
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Issued by SkillForge Academy on {formattedDate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleShare} className="btn btn-secondary btn-sm">
                  <Share2 size={15} /> Share Link
                </button>
                <button onClick={handlePrint} className="btn btn-primary btn-sm">
                  <Printer size={15} /> Print / Save PDF
                </button>
              </div>
            </div>

            {/* Certificate Canvas / Card */}
            <div
              className="certificate-card"
              id="printable-certificate"
              style={{
                backgroundColor: '#0c0d1f',
                padding: '3.5rem 3rem',
                borderRadius: 'var(--radius-lg)',
                border: '3px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {/* Corner Accents */}
              <div className="cert-border-corner cert-tl" />
              <div className="cert-border-corner cert-tr" />
              <div className="cert-border-corner cert-bl" />
              <div className="cert-border-corner cert-br" />

              {/* Certificate Header */}
              <div style={{ marginBottom: '1.8rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#facc15',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '1.2rem',
                  }}
                >
                  <ShieldCheck size={14} /> Official Verified Credential
                </div>
                <h2
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    color: '#f8fafc',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Certificate of Completion
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  This is proudly awarded to
                </p>
              </div>

              {/* Recipient Student */}
              <div style={{ margin: '1.8rem 0' }}>
                <h1
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '2.6rem',
                    fontWeight: '700',
                    color: '#d4af37',
                    borderBottom: '2px solid rgba(212, 175, 55, 0.35)',
                    display: 'inline-block',
                    paddingBottom: '0.5rem',
                    minWidth: '320px',
                  }}
                >
                  {certificate.studentName}
                </h1>
              </div>

              {/* Reason */}
              <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                for successfully meeting all academic requirements, completing every interactive lecture and hands-on assessment in
              </p>

              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#38bdf8',
                  marginBottom: '2.5rem',
                }}
              >
                {certificate.courseTitle}
              </h3>

              {/* Metadata Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginTop: '3.5rem',
                  paddingTop: '1.8rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* Date */}
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#f1f5f9' }}>{formattedDate}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date of Issue
                  </p>
                </div>

                {/* ID Stamp */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      padding: '5px 12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      marginBottom: '4px',
                    }}
                  >
                    ID: {certificate.certificateId}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Verified via EduPulse Registry
                  </p>
                </div>

                {/* Instructor Sign */}
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontFamily: 'cursive',
                      fontSize: '1.3rem',
                      color: '#d4af37',
                      marginBottom: '2px',
                    }}
                  >
                    {certificate.instructorName}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {certificate.instructorTitle || 'Lead Instructor Signature'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cert-border-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: #d4af37;
          border-style: solid;
        }
        .cert-tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
        .cert-tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
        .cert-bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
        .cert-br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 4px double #000;
            color: #000;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
