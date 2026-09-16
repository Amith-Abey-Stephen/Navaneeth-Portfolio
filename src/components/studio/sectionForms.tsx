"use client";

import { CHAR_LIMITS, ITEM_LIMITS } from "@/lib/limits";
import { experienceCompanies, marqueeIsCustom, marqueeNames } from "@/lib/marquee";
import type {
  About,
  CertificationItem,
  ContactInfo,
  DeveloperCredit,
  EducationItem,
  ExperienceItem,
  Hero,
  ProjectItem,
  Section,
  SeoSettings,
  SiteContent,
  SiteSettings,
  SkillGroup,
  StatItem,
  ToolItem,
} from "@/lib/types";
import { PROFICIENCY_LEVELS, PROJECT_VERTICALS, SECTION_LABELS } from "@/lib/types";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  DEFAULT_CANONICAL_URL,
  DEFAULT_DEVELOPER,
  DEFAULT_GEO_PLACENAME,
  DEFAULT_GEO_REGION,
  DEFAULT_TWITTER_HANDLE,
  getDerivedKeywords,
  getEffectiveSeo,
} from "@/lib/seo";
import { newId, SelectField, TextAreaField, TextField } from "./fields";
import { ImageField } from "./ImageField";
import { EntityList, StringListEditor } from "./lists";

export function HeroForm({ hero, onChange }: { hero: Hero; onChange: (h: Hero) => void }) {
  return (
    <div className="space-y-5">
      <TextField
        label="Name"
        value={hero.name}
        max={CHAR_LIMITS.hero.name}
        onChange={(name) => onChange({ ...hero, name })}
      />
      <TextField
        label="Tagline"
        value={hero.tagline}
        max={CHAR_LIMITS.hero.tagline}
        hint="Shown as the headline under your name."
        onChange={(tagline) => onChange({ ...hero, tagline })}
      />
      <TextAreaField
        label="Short bio"
        value={hero.shortBio}
        max={CHAR_LIMITS.hero.shortBio}
        rows={5}
        onChange={(shortBio) => onChange({ ...hero, shortBio })}
      />
      <ImageField
        label="Photo"
        image={hero.photo}
        ratio="1:1"
        pathPrefix="hero-photo"
        onChange={(photo) => onChange({ ...hero, photo: photo ?? { url: "", aspectRatio: "1:1" } })}
      />
    </div>
  );
}

export function ContactForm({
  contact,
  onChange,
}: {
  contact: ContactInfo;
  onChange: (c: ContactInfo) => void;
}) {
  return (
    <div className="space-y-5">
      {/* The phone number is no longer shown anywhere on the site, so it has
          no field here. A value saved earlier stays in the document untouched. */}
      <TextField
        label="Email"
        type="email"
        value={contact.email}
        hint={`Shown in Contact and the footer, and it's where "Let's talk" leads.`}
        onChange={(email) => onChange({ ...contact, email })}
      />
      <TextField
        label="LinkedIn URL"
        type="url"
        placeholder="https://www.linkedin.com/in/…"
        hint={`Adds a "Visit LinkedIn" card to Contact and a link in the footer.`}
        value={contact.linkedinUrl ?? ""}
        onChange={(linkedinUrl) => onChange({ ...contact, linkedinUrl: linkedinUrl || undefined })}
      />
      <TextField
        label="Resume URL"
        type="url"
        placeholder="https://…"
        hint="One link powers every Resume button — the header, the hero and the footer. Leave it empty and they don't show."
        value={contact.resumeUrl ?? ""}
        onChange={(resumeUrl) => onChange({ ...contact, resumeUrl: resumeUrl || undefined })}
      />
    </div>
  );
}

export function AboutForm({ data, onChange }: { data: About; onChange: (a: About) => void }) {
  return (
    <div className="space-y-5">
      <TextField
        label="Heading"
        value={data.heading}
        max={CHAR_LIMITS.about.heading}
        onChange={(heading) => onChange({ ...data, heading })}
      />
      <TextAreaField
        label="Body"
        value={data.body}
        max={CHAR_LIMITS.about.body}
        rows={12}
        hint="A blank line starts a new paragraph."
        onChange={(body) => onChange({ ...data, body })}
      />
    </div>
  );
}

export function StatsForm({ items, onChange }: { items: StatItem[]; onChange: (i: StatItem[]) => void }) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.stats}
      addLabel="Add stat"
      emptyLabel="Nothing here yet — add your first stat."
      create={(): StatItem => ({ id: newId("stat"), value: "", label: "" })}
      itemTitle={(s) => (s.value ? `${s.value} ${s.label}` : s.label)}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Value"
              value={item.value}
              max={CHAR_LIMITS.stat.value}
              hint="e.g. 12+ — can be empty when the icon says it."
              onChange={(value) => update({ value })}
            />
            <TextField
              label="Label"
              value={item.label}
              max={CHAR_LIMITS.stat.label}
              onChange={(label) => update({ label })}
            />
          </div>
          <ImageField
            label="Icon (optional)"
            image={item.icon}
            ratio="1:1"
            pathPrefix={`stat-${item.id}`}
            onChange={(icon) => update({ icon })}
          />
        </div>
      )}
    />
  );
}

export function ExperienceForm({
  items,
  onChange,
}: {
  items: ExperienceItem[];
  onChange: (i: ExperienceItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.experience}
      addLabel="Add experience"
      emptyLabel="Nothing here yet — add your first role."
      create={(): ExperienceItem => ({
        id: newId("exp"),
        company: "",
        role: "",
        startDate: "",
        endDate: "present",
        bullets: [],
      })}
      itemTitle={(e) => [e.role, e.company].filter(Boolean).join(" · ")}
      renderFields={(item, update) => {
        const isPresent = item.endDate === "present";
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Role"
                value={item.role}
                max={CHAR_LIMITS.experience.role}
                onChange={(role) => update({ role })}
              />
              <TextField
                label="Company"
                value={item.company}
                max={CHAR_LIMITS.experience.company}
                onChange={(company) => update({ company })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Start"
                type="month"
                value={item.startDate}
                onChange={(startDate) => update({ startDate })}
              />
              <div>
                <TextField
                  label="End"
                  type="month"
                  value={isPresent ? "" : item.endDate}
                  onChange={(endDate) => update({ endDate })}
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) => update({ endDate: e.target.checked ? "present" : "" })}
                    className="h-4 w-4 accent-[#0b0d10]"
                  />
                  I currently work here
                </label>
              </div>
            </div>
            <StringListEditor
              label="Bullets"
              values={item.bullets}
              maxItems={ITEM_LIMITS.experienceBullets}
              maxChars={CHAR_LIMITS.experience.bullet}
              addLabel="Add bullet"
              multiline
              onChange={(bullets) => update({ bullets })}
            />
            <TextField
              label="Highlight"
              value={item.highlight ?? ""}
              max={CHAR_LIMITS.experience.highlight}
              hint="The one standout outcome — shown as an accented callout."
              onChange={(highlight) => update({ highlight: highlight || undefined })}
            />
            <StringListEditor
              label="Tags"
              values={item.tags ?? []}
              maxItems={ITEM_LIMITS.experienceTags}
              maxChars={CHAR_LIMITS.experience.tag}
              addLabel="Add tag"
              onChange={(tags) => update({ tags: tags.length ? tags : undefined })}
            />
            <ImageField
              label="Company logo (optional)"
              image={item.logo}
              ratio="1:1"
              pathPrefix={`logo-${item.id}`}
              onChange={(logo) => update({ logo })}
            />
          </div>
        );
      }}
    />
  );
}

export function ProjectsForm({
  items,
  onChange,
}: {
  items: ProjectItem[];
  onChange: (i: ProjectItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.projects}
      addLabel="Add project"
      emptyLabel="Nothing here yet — add your first project."
      create={(): ProjectItem => ({
        id: newId("proj"),
        vertical: PROJECT_VERTICALS[0],
        title: "",
        coverImage: { url: "", aspectRatio: "16:9" },
        overview: "",
      })}
      itemTitle={(p) => p.title}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <SelectField
            label="Vertical"
            value={item.vertical}
            options={PROJECT_VERTICALS}
            onChange={(vertical) => update({ vertical })}
          />
          <TextField
            label="Title"
            value={item.title}
            max={CHAR_LIMITS.project.title}
            onChange={(title) => update({ title })}
          />
          <ImageField
            label="Cover image"
            image={item.coverImage}
            ratio="16:9"
            pathPrefix={`cover-${item.id}`}
            onChange={(coverImage) =>
              update({ coverImage: coverImage ?? { url: "", aspectRatio: "16:9" } })
            }
          />
          <TextAreaField
            label="Overview"
            value={item.overview}
            max={CHAR_LIMITS.project.overview}
            rows={5}
            onChange={(overview) => update({ overview })}
          />
          <TextAreaField
            label="Results & impact (optional)"
            value={item.resultsAndImpact ?? ""}
            max={CHAR_LIMITS.project.resultsAndImpact}
            rows={4}
            onChange={(v) => update({ resultsAndImpact: v || undefined })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Live URL (optional)"
              type="url"
              placeholder="https://…"
              value={item.liveUrl ?? ""}
              onChange={(v) => update({ liveUrl: v || undefined })}
            />
            <TextField
              label="Case study URL (optional)"
              type="url"
              placeholder="https://…"
              hint="Where the case study link should go."
              value={item.caseStudyUrl ?? ""}
              onChange={(v) => update({ caseStudyUrl: v || undefined })}
            />
          </div>
          <StringListEditor
            label="Tags"
            values={item.tags ?? []}
            maxItems={ITEM_LIMITS.projectTags}
            maxChars={CHAR_LIMITS.project.tag}
            addLabel="Add tag"
            onChange={(tags) => update({ tags: tags.length ? tags : undefined })}
          />
        </div>
      )}
    />
  );
}

export function ToolsForm({ items, onChange }: { items: ToolItem[]; onChange: (i: ToolItem[]) => void }) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.tools}
      addLabel="Add tool"
      emptyLabel="Nothing here yet — add your first tool."
      create={(): ToolItem => ({
        id: newId("tool"),
        name: "",
        icon: { url: "", aspectRatio: "1:1" },
        level: "Beginner",
      })}
      itemTitle={(t) => t.name}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Name"
              value={item.name}
              max={CHAR_LIMITS.tool.name}
              onChange={(name) => update({ name })}
            />
            <SelectField
              label="Level"
              value={item.level}
              options={PROFICIENCY_LEVELS}
              onChange={(level) => update({ level })}
            />
          </div>
          <ImageField
            label="Icon"
            image={item.icon}
            ratio="1:1"
            pathPrefix={`tool-${item.id}`}
            onChange={(icon) => update({ icon: icon ?? { url: "", aspectRatio: "1:1" } })}
          />
        </div>
      )}
    />
  );
}

export function SkillsForm({
  items,
  onChange,
}: {
  items: SkillGroup[];
  onChange: (i: SkillGroup[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.skillGroups}
      addLabel="Add skill group"
      emptyLabel="Nothing here yet — add your first skill group."
      create={(): SkillGroup => ({ id: newId("skill-grp"), category: "", skills: [] })}
      itemTitle={(g) => g.category}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Category"
            value={item.category}
            max={CHAR_LIMITS.skillGroup.category}
            onChange={(category) => update({ category })}
          />
          <StringListEditor
            label="Skills"
            values={item.skills}
            maxItems={ITEM_LIMITS.skillsPerGroup}
            maxChars={CHAR_LIMITS.skillGroup.skill}
            addLabel="Add skill"
            onChange={(skills) => update({ skills })}
          />
        </div>
      )}
    />
  );
}

export function CertificationsForm({
  items,
  onChange,
}: {
  items: CertificationItem[];
  onChange: (i: CertificationItem[]) => void;
}) {
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.certifications}
      addLabel="Add certification"
      emptyLabel="Nothing here yet — add your first certification."
      create={(): CertificationItem => ({ id: newId("cert"), title: "", issuer: "" })}
      itemTitle={(c) => c.title}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Title"
            value={item.title}
            max={CHAR_LIMITS.certification.title}
            hint="Title only — the issuer has its own field."
            onChange={(title) => update({ title })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Issuer"
              value={item.issuer}
              max={CHAR_LIMITS.certification.issuer}
              onChange={(issuer) => update({ issuer })}
            />
            <TextField
              label="Date (optional)"
              type="month"
              value={item.date ?? ""}
              onChange={(v) => update({ date: v || undefined })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Credential ID (optional)"
              value={item.credentialId ?? ""}
              onChange={(v) => update({ credentialId: v || undefined })}
            />
            <TextField
              label="Credential URL (optional)"
              type="url"
              placeholder="https://…"
              value={item.credentialUrl ?? ""}
              onChange={(v) => update({ credentialUrl: v || undefined })}
            />
          </div>
          <ImageField
            label="Badge (optional)"
            image={item.badge}
            ratio="1:1"
            pathPrefix={`badge-${item.id}`}
            onChange={(badge) => update({ badge })}
          />
        </div>
      )}
    />
  );
}

export function EducationForm({
  items,
  onChange,
}: {
  items: EducationItem[];
  onChange: (i: EducationItem[]) => void;
}) {
  const yearOnly = (v: string) => v.replace(/\D/g, "").slice(0, 4);
  return (
    <EntityList
      items={items}
      onChange={onChange}
      max={ITEM_LIMITS.education}
      addLabel="Add education"
      emptyLabel="Nothing here yet — add your first degree or program."
      create={(): EducationItem => ({ id: newId("edu"), degree: "", startYear: "", endYear: "" })}
      itemTitle={(e) => e.degree}
      renderFields={(item, update) => (
        <div className="space-y-4">
          <TextField
            label="Degree / program"
            value={item.degree}
            max={CHAR_LIMITS.education.degree}
            onChange={(degree) => update({ degree })}
          />
          <TextField
            label="Institution (optional)"
            value={item.institution ?? ""}
            max={CHAR_LIMITS.education.institution}
            onChange={(v) => update({ institution: v || undefined })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Start year"
              value={item.startYear}
              onChange={(v) => update({ startYear: yearOnly(v) })}
            />
            <TextField
              label="End year"
              value={item.endYear}
              onChange={(v) => update({ endYear: yearOnly(v) })}
            />
          </div>
        </div>
      )}
    />
  );
}

/** Sections move up/down and toggle as whole units — never rearranged internally. */
export function SectionsManager({
  sections,
  onChange,
}: {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  function commit(list: Section[]) {
    onChange(list.map((s, i) => ({ ...s, order: i + 1 })));
  }

  function move(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[to]] = [next[to], next[index]];
    commit(next);
  }

  function itemCount(s: Section): string {
    if (s.type === "about") return "";
    return `${s.items.length} ${s.items.length === 1 ? "item" : "items"}`;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Hidden sections stay editable but don&apos;t appear on the site. Your hero and contact info
        are always on the page.
      </p>
      {ordered.map((s, i) => (
        <div
          key={s.type}
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
        >
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={`Move ${SECTION_LABELS[s.type]} up`}
              disabled={i === 0}
              onClick={() => move(i, -1)}
              className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label={`Move ${SECTION_LABELS[s.type]} down`}
              disabled={i === ordered.length - 1}
              onClick={() => move(i, 1)}
              className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{SECTION_LABELS[s.type]}</p>
            <p className="text-xs text-muted">
              {[itemCount(s), s.visible ? "Shown" : "Hidden"].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            type="button"
            aria-label={s.visible ? `Hide ${SECTION_LABELS[s.type]}` : `Show ${SECTION_LABELS[s.type]}`}
            onClick={() =>
              onChange(sections.map((x) => (x.type === s.type ? { ...x, visible: !x.visible } : x)))
            }
            className={`rounded-lg p-2 transition-colors duration-200 ${
              s.visible ? "text-ink" : "text-muted/60"
            } hover:bg-bg`}
          >
            {s.visible ? (
              <Eye className="h-4.5 w-4.5" strokeWidth={2} />
            ) : (
              <EyeOff className="h-4.5 w-4.5" strokeWidth={2} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Site-level settings: the favicon and the hero's company banner. Both live
 * in `draft.settings` and follow the same autosave → Publish → history path
 * as everything else. The object is dropped entirely while nothing is set,
 * so an untouched site stays byte-identical to what was published.
 */
export function SiteSettingsForm({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (settings: SiteSettings | undefined) => void;
}) {
  const settings = content.settings ?? {};
  const custom = marqueeIsCustom(content);
  const names = marqueeNames(content);
  const derived = experienceCompanies(content);

  function commit(patch: Partial<SiteSettings>) {
    const next: SiteSettings = { ...settings, ...patch };
    const empty = !next.favicon?.url && !Array.isArray(next.marquee);
    onChange(empty ? undefined : next);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Favicon</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The small icon in the browser tab. A square image with a simple mark works best.
            Like everything here, the tab only changes once you publish.
          </p>
        </div>
        <ImageField
          label="Icon"
          image={settings.favicon}
          ratio="1:1"
          pathPrefix="favicon"
          maxWidth={256}
          onChange={(favicon) => commit({ favicon: favicon?.url ? favicon : undefined })}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Company banner</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The running line of company names along the bottom of the hero.{" "}
            {custom
              ? "This is your own list."
              : "Right now it follows the companies in your Experience section — change anything below to take over the list."}
          </p>
        </div>
        <StringListEditor
          label="Companies"
          values={names}
          maxItems={ITEM_LIMITS.marquee}
          maxChars={CHAR_LIMITS.marquee.company}
          addLabel="Add company"
          placeholder="Company name"
          onChange={(marquee) => commit({ marquee })}
        />
        {custom && names.length === 0 && (
          <p className="text-xs text-warning">The list is empty, so the banner is hidden.</p>
        )}
        {custom && (
          <button
            type="button"
            onClick={() => commit({ marquee: undefined })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Follow Experience again
            {derived.length > 0 ? ` (${derived.join(", ")})` : ""}
          </button>
        )}
      </section>
    </div>
  );
}

/**
 * SEO & Reach Management Form:
 * Real-time SERP / social preview, custom metadata overrides, OpenGraph image,
 * auto-derived keywords inspector, and developer SEO credits.
 */
export function SeoForm({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (seo: SeoSettings | undefined) => void;
}) {
  const seo = content.settings?.seo ?? {};
  const effective = getEffectiveSeo(content);
  const derivedKeywords = getDerivedKeywords(content);
  const dev = seo.developerCredit ?? DEFAULT_DEVELOPER;

  function commit(patch: Partial<SeoSettings>) {
    const next: SeoSettings = { ...seo, ...patch };
    onChange(next);
  }

  function commitDev(patch: Partial<DeveloperCredit>) {
    const nextDev: DeveloperCredit = { ...dev, ...patch };
    commit({ developerCredit: nextDev });
  }

  const hostname = (() => {
    try {
      return new URL(effective.canonicalUrl).hostname;
    } catch {
      return "thenavaneeth.com";
    }
  })();

  return (
    <div className="space-y-10">
      {/* Live Previews Header */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-ink">Live Search & Social Preview</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            See how your portfolio appears in Google search results and when shared on Twitter/X,
            LinkedIn, WhatsApp, and Slack.
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Search Snippet */}
          <div className="rounded-[16px] border border-line bg-surface p-4 sm:p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Globe className="h-3.5 w-3.5" />
              <span>Google Search Result</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                N
              </span>
              <div className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink">{hostname}</span>
                <span className="block truncate text-[11px] text-muted">{effective.canonicalUrl}</span>
              </div>
            </div>
            <div className="mt-2.5 text-base font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
              {effective.title}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2">
              {effective.description}
            </p>
          </div>

          {/* Social Share Card */}
          <div className="overflow-hidden rounded-[16px] border border-line bg-surface shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-line bg-surface/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Share2 className="h-3.5 w-3.5" />
              <span>Social Share Card (Twitter, LinkedIn, Slack)</span>
            </div>
            {effective.ogImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={effective.ogImageUrl}
                alt="Social Share Preview"
                className="aspect-[1.91/1] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[1.91/1] w-full flex-col justify-between bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b] p-6 text-white">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-semibold uppercase tracking-wider">{effective.twitterHandle}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px]">Auto Preview</span>
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-white">{content.hero.name}</div>
                  <div className="mt-1 text-sm text-white/75">{content.hero.tagline}</div>
                </div>
                <div className="text-xs text-white/40">{hostname}</div>
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                {hostname}
              </span>
              <div className="mt-1 text-sm font-semibold text-ink line-clamp-1">{effective.title}</div>
              <div className="mt-0.5 text-xs text-muted line-clamp-2">{effective.description}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meta Title & Description */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Metadata Overrides</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Customize how search engines index your page. Leave blank to automatically use your hero title and bio.
          </p>
        </div>

        <div className="space-y-4">
          <TextField
            label="Meta Title"
            value={seo.metaTitle ?? ""}
            max={CHAR_LIMITS.seo.metaTitle}
            placeholder={`${content.hero.name} — ${content.hero.tagline}`}
            hint={`Default: "${content.hero.name} — ${content.hero.tagline}". Google typically displays 50–60 characters.`}
            onChange={(metaTitle) => commit({ metaTitle: metaTitle || undefined })}
          />

          <TextAreaField
            label="Meta Description"
            value={seo.metaDescription ?? ""}
            max={CHAR_LIMITS.seo.metaDescription}
            rows={3}
            placeholder={content.hero.shortBio}
            hint="Default: Your hero short bio. Search engines typically display 140–160 characters in snippets."
            onChange={(metaDescription) => commit({ metaDescription: metaDescription || undefined })}
          />
        </div>
      </section>

      {/* Social & Canonical URLs */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Domain & Social Identity</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The canonical URL Google indexes and your X/Twitter handle for social attribution.
          </p>
        </div>

        <div className="space-y-4">
          <TextField
            label="Canonical URL"
            type="url"
            value={seo.canonicalUrl ?? ""}
            max={CHAR_LIMITS.seo.canonicalUrl}
            placeholder={DEFAULT_CANONICAL_URL}
            hint={`The permanent web address of this portfolio. Default: ${DEFAULT_CANONICAL_URL}`}
            onChange={(canonicalUrl) => commit({ canonicalUrl: canonicalUrl || undefined })}
          />

          <TextField
            label="X / Twitter Handle"
            value={seo.twitterHandle ?? ""}
            max={CHAR_LIMITS.seo.twitterHandle}
            placeholder={DEFAULT_TWITTER_HANDLE}
            hint={`Attributed in twitter:creator and twitter:site cards. Default: ${DEFAULT_TWITTER_HANDLE}`}
            onChange={(twitterHandle) => commit({ twitterHandle: twitterHandle || undefined })}
          />
        </div>
      </section>

      {/* OG Share Image */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Social Sharing Image (OpenGraph)</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The preview banner shown when your link is shared on social networks and messaging apps.
            Recommended size: 1200 × 630 px (16:9 ratio). If none is uploaded, your hero portrait is used.
          </p>
        </div>

        <ImageField
          label="Share Image (16:9)"
          image={seo.ogImage}
          ratio="16:9"
          pathPrefix="og-image"
          maxWidth={1200}
          onChange={(ogImage) => commit({ ogImage: ogImage?.url ? ogImage : undefined })}
        />
      </section>

      {/* Keywords & Search Engine Reach */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Search Engine Keywords & AI Reach</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            These keywords are automatically compiled from your projects, tools, skills, and experience to help Google, Perplexity, and AI search engines discover your work.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            Auto-derived keywords ({derivedKeywords.length})
          </p>
          <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-[12px] border border-line bg-surface/40 p-3">
            {derivedKeywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <StringListEditor
          label="Custom Additional Keywords"
          values={seo.keywords ?? []}
          maxItems={ITEM_LIMITS.seoKeywords}
          maxChars={CHAR_LIMITS.seo.keyword}
          addLabel="Add custom keyword"
          placeholder="e.g. Fintech Product Manager"
          onChange={(keywords) => commit({ keywords: keywords.length > 0 ? keywords : undefined })}
        />
      </section>

      {/* AI Agents & Answer Engine Optimization (AEO) */}
      <section className="space-y-4 rounded-[16px] border border-line bg-surface/30 p-5">
        <div className="flex items-center gap-1.5">
          <Bot className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink">AI Agents & Answer Engine Optimization (AEO)</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Perplexity, ChatGPT, Claude, and Gemini read your structured Markdown dossier and Schema.org FAQ graph to cite you for product leadership queries and cite Amith Abey Stephen as developer.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[12px] border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-line/40"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted" />
            <span>View /llms.txt (AI Summary)</span>
          </a>
          <a
            href="/llms-full.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[12px] border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-line/40"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted" />
            <span>View /llms-full.txt (Full Dossier)</span>
          </a>
        </div>
      </section>

      {/* Search Console & Analytics */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Search Console & Analytics</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Verify ownership with search engines and connect Google Analytics 4 for visitor tracking.
          </p>
        </div>

        <div className="space-y-4">
          <TextField
            label="Google Search Console Verification"
            value={seo.googleVerification ?? ""}
            max={CHAR_LIMITS.seo.googleVerification}
            placeholder="e.g. 4jPz9X... or content token"
            hint="The token from Google Search Console HTML tag method (google-site-verification)."
            onChange={(googleVerification) =>
              commit({ googleVerification: googleVerification || undefined })
            }
          />

          <TextField
            label="Bing Webmaster Verification"
            value={seo.bingVerification ?? ""}
            max={CHAR_LIMITS.seo.bingVerification}
            placeholder="e.g. 7A8B9C..."
            hint="The token for Bing Webmaster Tools (msvalidate.01)."
            onChange={(bingVerification) =>
              commit({ bingVerification: bingVerification || undefined })
            }
          />

          <TextField
            label="Google Analytics 4 (GA4) Measurement ID"
            value={seo.gaMeasurementId ?? ""}
            max={CHAR_LIMITS.seo.gaMeasurementId}
            placeholder="G-XXXXXXXXXX"
            hint="Starts with 'G-'. When provided, GA4 tracking scripts are automatically injected into the page."
            onChange={(gaMeasurementId) =>
              commit({ gaMeasurementId: gaMeasurementId || undefined })
            }
          />
        </div>
      </section>

      {/* Geographic & Regional Targeting (GEO) */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Geographic Targeting (GEO)</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Defines geographic signals (geo.region and ICBM coordinates) for local relevance and search algorithms.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Location Name"
            value={seo.geoPlacename ?? ""}
            max={CHAR_LIMITS.seo.geoPlacename}
            placeholder={DEFAULT_GEO_PLACENAME}
            hint={`Default: ${DEFAULT_GEO_PLACENAME}`}
            onChange={(geoPlacename) =>
              commit({ geoPlacename: geoPlacename || undefined })
            }
          />

          <TextField
            label="ISO Region Code"
            value={seo.geoRegion ?? ""}
            max={CHAR_LIMITS.seo.geoRegion}
            placeholder={DEFAULT_GEO_REGION}
            hint={`Default: ${DEFAULT_GEO_REGION}`}
            onChange={(geoRegion) =>
              commit({ geoRegion: geoRegion || undefined })
            }
          />
        </div>
      </section>

      {/* Developer SEO & Attribution */}
      <section className="space-y-4 rounded-[16px] border border-line bg-surface/30 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Developer Attribution & SEO Credits</h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Credits the developer in HTML metadata, Schema.org crawler graph, and the footer.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={dev.enabled}
              onChange={(e) => commitDev({ enabled: e.target.checked })}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-ink peer-focus:outline-none">
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        {dev.enabled && (
          <div className="space-y-3 border-t border-line pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Developer Name"
                value={dev.name}
                max={CHAR_LIMITS.seo.developerName}
                onChange={(name) => commitDev({ name })}
              />
              <TextField
                label="Credit Role"
                value={dev.role ?? "Developed by"}
                max={CHAR_LIMITS.seo.developerRole}
                hint="E.g. 'Developed by'"
                onChange={(role) => commitDev({ role })}
              />
            </div>
            <TextField
              label="Developer Website URL"
              type="url"
              value={dev.siteUrl}
              max={CHAR_LIMITS.seo.developerUrl}
              onChange={(siteUrl) => commitDev({ siteUrl })}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="LinkedIn Profile"
                type="url"
                value={dev.linkedinUrl ?? ""}
                placeholder="https://www.linkedin.com/in/amith-abey-stephen/"
                onChange={(linkedinUrl) => commitDev({ linkedinUrl: linkedinUrl || undefined })}
              />
              <TextField
                label="GitHub Profile"
                type="url"
                value={dev.githubUrl ?? ""}
                placeholder="https://github.com/Amith-Abey-Stephen/"
                onChange={(githubUrl) => commitDev({ githubUrl: githubUrl || undefined })}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

