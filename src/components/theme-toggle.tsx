export function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme-toggle"
      data-theme-toggle=""
      aria-label="Switch to dark theme"
      aria-pressed="false"
    >
      <span className="theme-toggle__option" data-theme-icon="light" data-active="true" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.59 1.59M6.87 17.13l-1.59 1.59M18.72 18.72l-1.59-1.59M6.87 6.87L5.28 5.28"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      <span className="theme-toggle__option" data-theme-icon="dark" data-active="false" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M15.5 2.8a8.95 8.95 0 1 0 5.7 12.9 9.7 9.7 0 0 1-3.83.78A9.68 9.68 0 0 1 7.7 6.83a9.7 9.7 0 0 1 .78-3.83 8.93 8.93 0 0 0 7.02-.2Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  )
}
