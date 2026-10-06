<script lang="ts">
  import { page } from '$app/state';
  import { SkipLink, PhaseBanner, Tag } from '@lilydesignsystem/svelte-headless';
  import { themeName } from '@lilydesignsystem/svelte-theme-picker';
  import { sizeName } from '@lilydesignsystem/svelte-text-size-picker';
  import type { ShareTarget } from '@lilydesignsystem/svelte-share-picker';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import { SITE_NAME, SITE_TAGLINE, SOURCE_URL, THEMES } from '#lib/site.js';

  let { children } = $props();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/roles/', label: 'Roles' },
    { href: '/families/', label: 'Families' },
    { href: '/bands/', label: 'Bands' },
    { href: '/skills/', label: 'Skills' },
    { href: '/job-evaluation/', label: 'Job evaluation' },
    { href: '/about/', label: 'About' }
  ];

  function isCurrent(href: string): boolean {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  // href is a function: this site owns the destination URLs, the share picker
  // ships none of its own. Mastodon and Bluesky take one combined "text"
  // parameter; the others take the URL and title separately.
  const shareTargets: ShareTarget[] = [
    {
      id: 'email',
      label: 'Email link',
      href: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      newTab: false
    },
    {
      id: 'linkedin',
      label: 'Share on LinkedIn',
      href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'reddit',
      label: 'Share on Reddit',
      href: (url, title) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    },
    {
      id: 'bluesky',
      label: 'Share on Bluesky',
      href: (url, title) => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n${url}`)}`
    },
    {
      id: 'mastodon',
      label: 'Share on Mastodon',
      href: (url, title) =>
        `https://mastodonshare.com/?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    }
  ];

  const pickerLabels = {
    theme: 'Choose colour theme',
    locale: 'Choose language',
    textSize: 'Choose text size',
    share: 'Share this page'
  };

  // English only for now; the data carries ESCO's multilingual labels for a
  // later translation.
  const locales = ['en'];

  let themeStatus = $state('');
  let sizeStatus = $state('');

  // page.data.title convention: every route's load function sets `title` to
  // its full <title> text, so the layout can share any page correctly.
  const shareTitle = $derived(page.data.title ?? SITE_NAME);
</script>

<SkipLink href="#main" label="Skip to main content" />

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href="/">
      <img class="site-brand-mark" src="/assets/favicon.svg" alt="" aria-hidden="true" />
      <span class="site-brand-text">
        <span class="site-brand-name">{SITE_NAME}</span>
        <span class="site-brand-tagline">{SITE_TAGLINE}</span>
      </span>
    </a>
    <nav class="site-nav" aria-label="Main">
      {#each navLinks as link (link.href)}
        <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a>
      {/each}
      <a href={SOURCE_URL}>GitHub</a>
    </nav>
    <PickerBar
      class="site-tools"
      labels={pickerLabels}
      themesUrl="/assets/themes/"
      themes={THEMES}
      themeProps={{
        storageKey: 'roles-skills:theme',
        // A calm blue default for a health care audience, not the visitor's
        // OS light/dark preference: Lily's generic light and dark themes use a
        // purple and pink palette. A reader can still pick any theme.
        defaultValue: 'corporate',
        onChange: (theme: string) => (themeStatus = `Colour theme: ${themeName(theme)}`)
      }}
      {locales}
      sizes={['small', 'medium', 'large', 'x-large']}
      textSizeProps={{
        defaultValue: 'medium',
        storageKey: 'roles-skills:text-size',
        onChange: (size: string) => (sizeStatus = `Text size: ${sizeName(size)}`)
      }}
      {shareTargets}
      shareProps={{
        title: shareTitle,
        copyLabel: 'Copy link',
        copiedLabel: 'Link copied to your clipboard',
        copyFailedLabel: 'Could not copy the link'
      }}
    />
    <p class="theme-picker-status visually-hidden" aria-live="polite">{themeStatus}</p>
    <p class="text-size-picker-status visually-hidden" aria-live="polite">{sizeStatus}</p>
  </div>
</header>

<PhaseBanner class="site-phase-banner">
  <Tag label="Status">Illustrative</Tag>
  <span>
    Reference profiles for a generic digital health care organisation, not official job descriptions.
    <a href="/about/">About this reference</a>.
  </span>
</PhaseBanner>

<main id="main" class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <div>
      <p>{SITE_TAGLINE}: an open reference of roles, bands, skills, and responsibilities.</p>
      <p class="site-footer-fine">
        Contains public sector information from the UK Government Digital and Data Profession Capability
        Framework, licensed under the Open Government Licence v3.0. Contains ESCO v1.2.1 data, © European
        Union. Original content under CC BY 4.0. Built with the
        <a href="https://lilydesignsystem.com/">Lily Design System™</a>.
      </p>
    </div>
    <div class="site-footer-links">
      <a href="/roles/">Roles</a>
      <a href="/skills/">Skills</a>
      <a href="/job-evaluation/">Job evaluation</a>
      <a href="/about/">About</a>
      <a href={SOURCE_URL}>GitHub</a>
    </div>
  </div>
</footer>
