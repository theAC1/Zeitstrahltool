'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';

/**
 * Skip Links for keyboard navigation
 * Allows users to skip to main content or navigation
 */
export function SkipLinks() {
  const { t } = useI18n();

  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        {t('accessibility.skipToContent')}
      </a>
      <a href="#main-navigation" className="skip-link">
        {t('accessibility.skipToNavigation')}
      </a>
      <style jsx>{`
        .skip-links {
          position: relative;
          z-index: 9999;
        }
        .skip-link {
          position: absolute;
          left: -9999px;
          top: 0;
          padding: 1rem 1.5rem;
          background: #4a90e2;
          color: white;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0 0 0.5rem 0;
          transition: all 0.2s;
        }
        .skip-link:focus {
          left: 0;
          outline: 3px solid #2563eb;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
