import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ThemeToggle } from '../components/theme-toggle.tsx'

import '../tailwind.css'
import '../styles.css'

const themeBootScript = `
(() => {
  const storageKey = 'justquizme-theme';
  const lightThemeColor = '#f4efe7';
  const darkThemeColor = '#121212';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    const storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
  }

  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function getActiveTheme() {
    return getStoredTheme() ?? getSystemTheme();
  }

  function updateThemeColor(theme) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? darkThemeColor : lightThemeColor);
    }
  }

  function updateThemeIcons(theme) {
    document.querySelectorAll('[data-theme-icon-link]').forEach((iconLink) => {
      const nextHref = theme === 'dark'
        ? iconLink.getAttribute('data-dark-href')
        : iconLink.getAttribute('data-light-href');

      if (nextHref) {
        iconLink.setAttribute('href', nextHref);
      }
    });
  }

  function applyThemeOverride(theme) {
    if (theme === null) {
      document.documentElement.removeAttribute('data-theme');
      window.localStorage.removeItem(storageKey);
    } else {
      document.documentElement.dataset.theme = theme;
      window.localStorage.setItem(storageKey, theme);
    }

    const activeTheme = getActiveTheme();
    updateThemeColor(activeTheme);
    updateThemeIcons(activeTheme);
    syncThemeToggles();
  }

  function syncThemeToggles() {
    const activeTheme = getActiveTheme();

    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      const isDark = activeTheme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme',
      );

      toggle.querySelectorAll('[data-theme-icon]').forEach((icon) => {
        const iconTheme = icon.getAttribute('data-theme-icon');
        const isActive =
          (iconTheme === 'light' && activeTheme === 'light') ||
          (iconTheme === 'dark' && activeTheme === 'dark');

        icon.setAttribute('data-active', String(isActive));
      });
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const toggle = target.closest('[data-theme-toggle]');

    if (!toggle) {
      return;
    }

    const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
    applyThemeOverride(nextTheme);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncThemeToggles, { once: true });
  } else {
    syncThemeToggles();
  }

  mediaQuery.addEventListener('change', () => {
    if (getStoredTheme() !== null) {
      return;
    }

    document.documentElement.removeAttribute('data-theme');
    updateThemeColor(getSystemTheme());
    updateThemeIcons(getSystemTheme());
    syncThemeToggles();
  });

  const initialTheme = getStoredTheme();

  if (initialTheme) {
    document.documentElement.dataset.theme = initialTheme;
  }

  updateThemeColor(getActiveTheme());
  updateThemeIcons(getActiveTheme());
})();
`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Just Quiz Me',
      },
      {
        name: 'description',
        content:
          'Play quick absurd quizzes, get an immediate result, and send it to someone you trust far too much.',
      },
      {
        property: 'og:site_name',
        content: 'Just Quiz Me',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'theme-color',
        content: '#f4efe7',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
        'data-theme-icon-link': '',
        'data-light-href': '/favicon.svg',
        'data-dark-href': '/favicon-dark.svg',
      },
      {
        rel: 'icon',
        href: '/icons/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
        'data-theme-icon-link': '',
        'data-light-href': '/icons/favicon-32x32.png',
        'data-dark-href': '/icons/favicon-32x32-dark.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          <div className="site-shell">
            <div className="site-toolbar">
              <div className="site-toolbar__inner">
                <ThemeToggle />
              </div>
            </div>
            {children}
          </div>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-16 sm:px-8">
      <div className="w-full border-t border-[color:var(--rule)] pt-8 text-center">
        <p className="eyebrow mb-3">Not found</p>
        <h1 className="display-type text-3xl text-[var(--ink)] sm:text-4xl">
          That quiz wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          The page you wanted is missing, unpublished, or was never real in the
          first place.
        </p>
        <a
          href="/"
          className="button-secondary mt-6"
        >
          Back to the quiz pile
        </a>
      </div>
    </main>
  )
}
