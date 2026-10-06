<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta
    name="description"
    content="Plausible job roles for a digital health care organisation: titles, bands, responsibilities, skills, and job evaluation scores, aligned with the UK GDaD PCF and ESCO, for self assessment, performance review, and skills gap analysis."
  />
</svelte:head>

<div class="page-intro">
  <h1>Roles and skills for digital health care</h1>
  <p class="page-lede">
    Plausible job roles for a digital health care organisation, from service desk to director. Each
    role level has a title, a band, responsibilities, skills with expected levels, and job evaluation
    scores, aligned with the UK Government Digital and Data Profession Capability Framework and ESCO.
  </p>
  <div class="button-row">
    <a class="button" href="/roles/">Find a role</a>
    <a class="button button-secondary" href="/families/">Browse families</a>
    <a class="button button-secondary" href="/skills/">Browse skills</a>
  </div>
</div>

<ul class="stat-row">
  <li class="statistic"><span class="statistic-value">{data.familyCount}</span><span class="statistic-title">families</span></li>
  <li class="statistic"><span class="statistic-value">{data.roleCount}</span><span class="statistic-title">roles</span></li>
  <li class="statistic"><span class="statistic-value">{data.levelCount}</span><span class="statistic-title">role levels</span></li>
  <li class="statistic"><span class="statistic-value">{data.skillCount}</span><span class="statistic-title">skills</span></li>
</ul>

<div class="prose">
  <h2>What you can do here</h2>

  <h3>Find a role like yours</h3>
  <p>
    <a href="/roles/">Search every role level</a>, or browse by <a href="/families/">family</a> or
    <a href="/bands/">band</a>. Pick the closest match: many jobs mix two roles.
  </p>

  <h3>Assess yourself</h3>
  <p>
    Every role level page has a self assessment. Rate yourself against each skill, add evidence, and see
    your gaps. Your answers stay in your own browser, and you can download them as a spreadsheet file to
    take to your manager.
  </p>

  <h3>Prepare a performance review</h3>
  <p>
    Each role level sets out what the role expects at that band: responsibilities, skills and their
    levels, and a short band outline. Use it as a shared starting point for development conversations.
  </p>

  <h3>Analyse a team's skills gaps</h3>
  <p>
    Download each person's completed self assessment and combine them with the gap analysis script in
    <a href="https://github.com/roles-skills/roles-skills">the repository</a>, to see a team's strengths
    and gaps skill by skill.
  </p>

  <h3>See why a role sits in its band</h3>
  <p>
    Every role level is scored on <a href="/job-evaluation/">16 job evaluation factors</a>, such as
    knowledge, freedom to act, and mental effort. The total places it in its band. The scores are
    illustrative, not a formal evaluation.
  </p>
</div>
