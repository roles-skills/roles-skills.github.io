<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { WarningCallout } from '@lilydesignsystem/svelte-headless';
  import { SOURCE_URL } from '#lib/site.js';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="What this reference is, how it was built, the frameworks it uses, and its licences." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'About' }]} />

<div class="page-intro">
  <h1>About this reference</h1>
  <p class="page-lede">
    An open reference of plausible job roles for a generic digital health care organisation, for skills gap
    analysis, performance review, and self assessment.
  </p>
</div>

<WarningCallout>
  <p>
    These are illustrative reference profiles for a generic digital health care organisation. They are not
    official job descriptions for any employer, and their job evaluation scores are not a formal evaluation.
    Where your actual job description, objectives, or evaluated job differ, those take priority.
  </p>
</WarningCallout>

<div class="prose">
  <h2>Frameworks</h2>
  <h3>UK Government Digital and Data Profession Capability Framework</h3>
  <p>
    The <a href="https://understand-digital-data-roles-skills.service.gov.uk/">UK GDaD PCF</a> describes 53
    digital and data roles, 206 role levels, and 186 skills, each skill on four levels. Where one of its roles
    fits, this reference uses it as the base, quotes its role and level descriptions and skills word for word,
    and uses its Civil Service grades to suggest bands. Contains public sector information licensed under the
    <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence v3.0</a>.
    © Crown copyright.
  </p>

  <h3>ESCO</h3>
  <p>
    <a href="https://esco.ec.europa.eu/">ESCO</a>, the European Skills, Competences, Qualifications and
    Occupations classification, describes 3,039 occupations and 13,939 skills and knowledge concepts in 28
    languages. Every role here links to ESCO occupations, with their essential and optional skills, and every
    skill links to its closest ESCO skills. Contains ESCO v1.2.1 data. © European Union. Reuse authorised under
    Commission Decision 2011/833/EU.
  </p>

  <h3>SFIA</h3>
  <p>
    Each band records its typical <a href="https://sfia-online.org/">SFIA</a> level of responsibility. SFIA
    levels are named only; SFIA text is not reproduced.
  </p>

  <h2>Downloads</h2>
  <ul>
    <li><a href="/downloads/roles.tsv" download>roles.tsv</a>: every role level, with family, band, PCF and ESCO links, and job evaluation points</li>
    <li><a href="/downloads/role-skills.tsv" download>role-skills.tsv</a>: every role level and skill, with its expected level</li>
    <li><a href="/downloads/job-evaluation.tsv" download>job-evaluation.tsv</a>: every role level's 16 factor levels and total points</li>
    <li><a href="/downloads/reference.json" download>reference.json</a>: the whole reference, as one JSON file</li>
  </ul>
  <p>Each role level page also links to its own blank self-assessment file.</p>

  <h2>How it is built</h2>
  <p>
    The data lives as YAML in <a href={SOURCE_URL}>the repository</a>, where a build script validates every
    role level, including that its job evaluation total falls within its band, and generates this site's
    data. Editors can change the data in a browser through the <a href="/admin/">content manager</a>, which
    commits to the repository. This site is prerendered with SvelteKit and built with the
    <a href="https://lilydesignsystem.com/">Lily Design System™</a>.
  </p>

  <h2>Licence</h2>
  <p>
    Original content is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
    Framework content keeps its own licence, as above.
  </p>
</div>
