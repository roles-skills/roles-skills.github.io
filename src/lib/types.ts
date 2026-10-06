// Shapes shared by the server-side content module and the pages. Everything
// here can reach the browser, so keep it to types and tiny helpers.

export type SkillLevelId = 'awareness' | 'working' | 'practitioner' | 'expert';

export type EscoLink = { uri: string; label: string; match: string };

export type Skill = {
  id: string;
  slug: string;
  name: string;
  description: string;
  source: 'pcf' | 'reference';
  file: string;
  levels: Record<SkillLevelId, string>;
  esco: EscoLink[];
};

export type LevelSkill = { id: string; slug: string; level: SkillLevelId; levelNumber: number };

export type Level = {
  slug: string;
  title: string;
  band: string;
  summary: string;
  pcfLevel: string | null;
  pcfLevelDescription: string | null;
  civilServiceGrades: string;
  responsibilities: string[];
  qualifications: string[];
  skills: LevelSkill[];
  jobEvaluation: Record<string, string>;
  jobEvaluationPoints: number;
  jobEvaluationNotes: string;
  selfAssessmentFile: string;
};

export type Role = {
  id: string;
  slug: string;
  title: string;
  family: string;
  summary: string;
  healthContext: string[];
  pcfRole: { name: string; url: string; description: string; family: string } | null;
  esco: string[];
  levels: Level[];
  sources: string[];
};

export type Family = { id: string; title: string; pcfFamily: string | null; roles: string[] };

export type Band = {
  id: string;
  title: string;
  stage: string;
  sfia_level: string;
  civil_service_grades: string[];
  knowledge: string;
  autonomy: string;
  scope: string;
  leadership: string;
  accountability: string;
  points: { min: number; max: number };
};

export type Factor = {
  id: string;
  name: string;
  description: string;
  levels: Record<string, string>;
  points: Record<string, number>;
};

export type EscoSkill = { uri: string; label: string; type: string };

export type Occupation = {
  id: string;
  uri: string;
  label: string;
  code: string;
  isco08: string;
  isco08Label: string;
  description: string;
  alternativeLabels: string[];
  essential: EscoSkill[];
  optional: EscoSkill[];
};

export type Meta = {
  title: string;
  disclaimer: string;
  pcf: { name: string; url: string; accessed: string; credit: string };
  esco: { name: string; version: string; url: string; accessed: string; credit: string };
  levels: { id: SkillLevelId; number: number; name: string }[];
};

export type Reference = {
  meta: Meta;
  families: Family[];
  bands: Band[];
  factors: Factor[];
  skills: Skill[];
  occupations: Occupation[];
  roles: Role[];
};

/** One row of the role finder: a role level, with what it is searched by. */
export type LevelRow = {
  href: string;
  title: string;
  band: string;
  roleTitle: string;
  familyTitle: string;
  pcfLevel: string | null;
};

export const LEVEL_NAMES: Record<SkillLevelId, string> = {
  awareness: 'Awareness',
  working: 'Working',
  practitioner: 'Practitioner',
  expert: 'Expert'
};

export function roleHref(role: { slug: string }): string {
  return `/roles/${role.slug}/`;
}

export function levelHref(role: { slug: string }, level: { slug: string }): string {
  return `/roles/${role.slug}/${level.slug}/`;
}

export function skillHref(skill: { slug: string }): string {
  return `/skills/${skill.slug}/`;
}

export function bandHref(band: string): string {
  return `/bands/${band}/`;
}

export function familyHref(family: { id: string }): string {
  return `/families/${family.id}/`;
}

/** Split framework text into blocks: each plain line a paragraph, each run of "- " lines a list. */
export function textBlocks(text: string): ({ kind: 'p'; text: string } | { kind: 'ul'; items: string[] })[] {
  const blocks: ({ kind: 'p'; text: string } | { kind: 'ul'; items: string[] })[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'ul') last.items.push(line.slice(2));
      else blocks.push({ kind: 'ul', items: [line.slice(2)] });
    } else {
      blocks.push({ kind: 'p', text: line });
    }
  }
  return blocks;
}

/** Split a framework's "You can:\n- a\n- b" text into its lead line and bullets. */
export function splitBullets(text: string): { lead: string; items: string[] } {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const items = lines.filter((line) => line.startsWith('- ')).map((line) => line.slice(2));
  const lead = lines.filter((line) => !line.startsWith('- ')).join(' ');
  return { lead, items };
}
