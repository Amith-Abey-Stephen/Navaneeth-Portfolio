"use client";

import { useState } from "react";
import { CHAR_LIMITS, ITEM_LIMITS } from "@/lib/limits";
import { experienceCompanies, marqueeIsCustom, marqueeNames, getBannerCompanies, type BannerCompanyItem } from "@/lib/marquee";
import { COLOR_PALETTES } from "@/lib/palettes";
import type {
  About,
  CertificationItem,
  CompanyLogoOverride,
  ContactInfo,
  CustomCompany,
  EducationItem,
  ExperienceItem,
  Hero,
  ImageRef,
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
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Palette,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  DEFAULT_CANONICAL_URL,
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
  categories,
  onCategoriesChange,
  onChange,
}: {
  items: ProjectItem[];
  categories?: string[];
  onCategoriesChange?: (cats: string[] | undefined) => void;
  onChange: (i: ProjectItem[]) => void;
}) {
  const [newCat, setNewCat] = useState("");
  const [catError, setCatError] = useState<string | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingVal, setEditingVal] = useState("");

  const effectiveCategories =
    categories && categories.length > 0 ? categories : [...PROJECT_VERTICALS];

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError(null);
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (trimmed.length > CHAR_LIMITS.projectCategory) {
      setCatError(`Category must be ${CHAR_LIMITS.projectCategory} characters or less.`);
      return;
    }
    if (effectiveCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCatError("This category already exists.");
      return;
    }
    const next = [...effectiveCategories, trimmed];
    onCategoriesChange?.(next);
    setNewCat("");
  }

  function handleRenameCategory(index: number) {
    const trimmed = editingVal.trim();
    setEditingIdx(null);
    if (!trimmed) return;
    const oldCat = effectiveCategories[index];
    if (oldCat === trimmed) return;
    if (effectiveCategories.some((c, i) => i !== index && c.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }
    const next = [...effectiveCategories];
    next[index] = trimmed;
    onCategoriesChange?.(next);

    const updatedItems = items.map((p) => (p.vertical === oldCat ? { ...p, vertical: trimmed } : p));
    onChange(updatedItems);
  }

  function handleDeleteCategory(index: number) {
    if (effectiveCategories.length <= 1) return;
    const catToRemove = effectiveCategories[index];
    const next = effectiveCategories.filter((_, i) => i !== index);
    onCategoriesChange?.(next);

    const fallback = next[0];
    const updatedItems = items.map((p) =>
      p.vertical === catToRemove ? { ...p, vertical: fallback } : p
    );
    onChange(updatedItems);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-line bg-surface/50 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Project Categories & Verticals</h3>
            <p className="mt-0.5 text-xs text-muted">
              Projects on your public site are grouped by these categories.
            </p>
          </div>
          {categories && categories.length > 0 && (
            <button
              type="button"
              onClick={() => onCategoriesChange?.(undefined)}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors"
              title="Reset to default categories"
            >
              <RotateCcw className="h-3 w-3" />
              Reset defaults
            </button>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {effectiveCategories.map((cat, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink shadow-sm"
            >
              {editingIdx === idx ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameCategory(idx);
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={editingVal}
                    onChange={(e) => setEditingVal(e.target.value)}
                    onBlur={() => handleRenameCategory(idx)}
                    autoFocus
                    className="h-6 w-28 rounded border border-accent bg-bg px-1.5 text-xs text-ink focus:outline-none"
                    maxLength={CHAR_LIMITS.projectCategory}
                  />
                </form>
              ) : (
                <span
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditingVal(cat);
                  }}
                  className="cursor-pointer hover:underline"
                  title="Click to rename"
                >
                  {cat}
                </span>
              )}
              {effectiveCategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(idx)}
                  className="ml-0.5 text-muted hover:text-warning transition-colors"
                  title={`Remove ${cat}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCategory} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Add new category…"
            maxLength={CHAR_LIMITS.projectCategory}
            className="h-8 max-w-xs flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newCat.trim()}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink transition-colors hover:bg-surface/80 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add category
          </button>
        </form>
        {catError && <p className="mt-1.5 text-xs text-warning">{catError}</p>}
      </div>

      <EntityList
        items={items}
        onChange={onChange}
        max={ITEM_LIMITS.projects}
        addLabel="Add project"
        emptyLabel="Nothing here yet — add your first project."
        create={(): ProjectItem => ({
          id: newId("proj"),
          vertical: effectiveCategories[0] ?? PROJECT_VERTICALS[0],
          title: "",
          coverImage: { url: "", aspectRatio: "16:9" },
          overview: "",
        })}
        itemTitle={(p) => p.title}
        renderFields={(item, update) => {
          const allCategoryOptions = Array.from(
            new Set([...effectiveCategories, item.vertical])
          ).filter(Boolean);

          return (
            <div className="space-y-4">
              <SelectField
                label="Category / Vertical"
                value={item.vertical}
                options={allCategoryOptions}
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
          );
        }}
      />
    </div>
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
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                aria-label={`Display name for ${SECTION_LABELS[s.type]}`}
                value={s.label ?? ""}
                placeholder={SECTION_LABELS[s.type]}
                maxLength={CHAR_LIMITS.sectionLabel}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(
                    sections.map((x) =>
                      x.type === s.type ? { ...x, label: val ? val : undefined } : x,
                    ),
                  );
                }}
                className="w-full max-w-[200px] rounded-lg border border-line bg-bg/60 px-2.5 py-1 text-sm font-semibold text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:bg-surface focus:outline-none sm:max-w-[240px]"
              />
              {s.label && s.label.trim() !== SECTION_LABELS[s.type] && (
                <span className="text-[11px] text-muted">({SECTION_LABELS[s.type]})</span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">
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
  const bannerCompanies = getBannerCompanies(content);
  const [newCompName, setNewCompName] = useState("");
  const [editingLogoCompany, setEditingLogoCompany] = useState<string | null>(null);

  function commit(patch: Partial<SiteSettings>) {
    const next: SiteSettings = { ...settings, ...patch };
    const empty =
      !next.favicon?.url &&
      !Array.isArray(next.marquee) &&
      !next.customCompanies?.length &&
      (!next.companyOverrides || Object.keys(next.companyOverrides).length === 0) &&
      !next.copyrightText &&
      !next.projectCategories?.length &&
      !next.palette &&
      !next.seo;
    onChange(empty ? undefined : next);
  }

  function handleAddCustomCompany(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newCompName.trim();
    if (!trimmed) return;
    if (trimmed.length > CHAR_LIMITS.experience.company) return;
    const newComp: CustomCompany = {
      id: newId("comp"),
      name: trimmed,
      showLogo: true,
    };
    commit({
      customCompanies: [...(settings.customCompanies ?? []), newComp],
    });
    setNewCompName("");
  }

  function handleRemoveCustomCompany(name: string) {
    commit({
      customCompanies: (settings.customCompanies ?? []).filter(
        (c) => c.name.toLowerCase() !== name.toLowerCase()
      ),
    });
  }

  function handleToggleLogo(c: BannerCompanyItem) {
    if (c.isCustom) {
      commit({
        customCompanies: (settings.customCompanies ?? []).map((comp) =>
          comp.name.toLowerCase() === c.name.toLowerCase()
            ? { ...comp, showLogo: !c.showLogo }
            : comp
        ),
      });
    } else {
      const key = c.name.toLowerCase().trim();
      const existing = settings.companyOverrides?.[key] ?? {};
      commit({
        companyOverrides: {
          ...settings.companyOverrides,
          [key]: { ...existing, showLogo: !c.showLogo },
        },
      });
    }
  }

  function handleUpdateLogo(c: BannerCompanyItem, logo?: ImageRef) {
    if (c.isCustom) {
      commit({
        customCompanies: (settings.customCompanies ?? []).map((comp) =>
          comp.name.toLowerCase() === c.name.toLowerCase() ? { ...comp, logo } : comp
        ),
      });
    } else {
      const key = c.name.toLowerCase().trim();
      const existing = settings.companyOverrides?.[key] ?? {};
      commit({
        companyOverrides: {
          ...settings.companyOverrides,
          [key]: { ...existing, customLogo: logo },
        },
      });
    }
  }

  function handleResetOverride(companyName: string) {
    const key = companyName.toLowerCase().trim();
    const nextOverrides = { ...(settings.companyOverrides ?? {}) };
    delete nextOverrides[key];
    commit({
      companyOverrides: Object.keys(nextOverrides).length > 0 ? nextOverrides : undefined,
    });
  }

  return (
    <div className="space-y-8">
      {/* Color Palette Selector */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Color Palette & Mood</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Select an ambient theme for your portfolio. This sets coordinated background tones, card surfaces, borders, glow lights, and accent highlights.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_PALETTES.map((p) => {
            const isActive = (settings.palette ?? "default") === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => commit({ palette: p.id === "default" ? undefined : p.id })}
                className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-accent bg-surface ring-1 ring-accent shadow-sm"
                    : "border-line bg-surface/50 hover:border-ink/20 hover:bg-surface"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink">{p.name}</span>
                    {isActive ? (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px]">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-line" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-muted line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-line/50">
                  {p.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="h-3.5 w-3.5 rounded-full border border-white/10 shadow-inner"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Company Banner Manager */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Company Banner (Hero Strip)</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Companies displayed in the hero marquee banner. Automatically synchronizes with your Experience section, and you can add custom companies or independently customize each logo.
          </p>
        </div>

        {/* Companies list */}
        <div className="space-y-2 rounded-xl border border-line bg-surface/40 p-3 sm:p-4">
          {bannerCompanies.length === 0 ? (
            <p className="text-xs text-muted">No companies to display. Add experience or custom companies below.</p>
          ) : (
            bannerCompanies.map((c) => {
              const isExpanded = editingLogoCompany === c.name;
              const hasOverride = Boolean(settings.companyOverrides?.[c.name.toLowerCase().trim()]);
              const logoSrc = c.customLogo?.url || c.logoSrc;

              return (
                <div key={c.name} className="rounded-lg border border-line bg-surface p-2.5 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-bg border border-line">
                        {logoSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoSrc} alt={c.name} className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <span className="text-[10px] font-bold text-muted">{c.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-ink">{c.name}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${c.isCustom ? "bg-accent/10 text-accent" : "bg-surface/80 text-muted border border-line"}`}>
                            {c.isCustom ? "Custom" : "Experience"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleLogo(c)}
                        title={c.showLogo ? "Hide logo in banner" : "Show logo in banner"}
                        className={`rounded p-1.5 text-xs transition-colors ${c.showLogo ? "text-accent bg-accent/10" : "text-muted hover:text-ink"}`}
                      >
                        {c.showLogo ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingLogoCompany(isExpanded ? null : c.name)}
                        title="Edit logo"
                        className="rounded p-1.5 text-xs text-muted hover:text-ink transition-colors"
                      >
                        <span className="text-[11px] font-medium underline">Logo</span>
                      </button>

                      {hasOverride && (
                        <button
                          type="button"
                          onClick={() => handleResetOverride(c.name)}
                          title="Reset to original experience logo"
                          className="rounded p-1.5 text-xs text-muted hover:text-ink transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {c.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomCompany(c.name)}
                          title="Remove custom company"
                          className="rounded p-1.5 text-xs text-muted hover:text-warning transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-line">
                      <p className="mb-2 text-xs text-muted">Custom logo for {c.name} (1:1 square recommended):</p>
                      <ImageField
                        label="Logo mark"
                        image={c.customLogo ?? (logoSrc ? { url: logoSrc, aspectRatio: "1:1" } : undefined)}
                        ratio="1:1"
                        maxWidth={256}
                        pathPrefix={`banner-logo-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                        onChange={(logo) => handleUpdateLogo(c, logo?.url ? logo : undefined)}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleAddCustomCompany} className="flex items-center gap-2">
          <input
            type="text"
            value={newCompName}
            onChange={(e) => setNewCompName(e.target.value)}
            placeholder="Add custom company to banner…"
            maxLength={CHAR_LIMITS.experience.company}
            className="h-8 max-w-sm flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newCompName.trim()}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink transition-colors hover:bg-surface/80 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add company
          </button>
        </form>
      </section>

      {/* Favicon */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Favicon</h3>
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

      {/* Footer Copyright Notice */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Footer Copyright</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Custom copyright notice rendered at the very bottom of every page. Leave blank to automatically display current year and your name.
          </p>
        </div>
        <TextField
          label="Copyright notice"
          value={settings.copyrightText ?? ""}
          max={CHAR_LIMITS.copyright}
          placeholder={`© ${new Date().getFullYear()} ${content.hero.name}. All rights reserved.`}
          onChange={(copyrightText) => commit({ copyrightText: copyrightText || undefined })}
        />
      </section>
    </div>
  );
}

/**
 * SEO & Reach Management Form:
 * Real-time SERP / social preview, custom metadata overrides, OpenGraph image,
 * auto-derived keywords inspector, and verification tokens.
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

  function commit(patch: Partial<SeoSettings>) {
    const next: SeoSettings = { ...seo, ...patch };
    onChange(next);
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

          <TextField
            label="Microsoft Clarity Project ID"
            value={seo.clarityProjectId ?? ""}
            max={CHAR_LIMITS.seo.clarityProjectId}
            placeholder="e.g. abc123xyz"
            hint="Starts with letters/numbers from your Clarity dashboard. Enables heatmaps and session recordings on your live portfolio."
            onChange={(clarityProjectId) =>
              commit({ clarityProjectId: clarityProjectId?.trim() || undefined })
            }
          />
        </div>
      </section>

      {/* GEO & Local Entity Knowledge Graph */}
      <section className="space-y-4 rounded-[16px] border border-line bg-surface/30 p-5">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink">GEO Targeting & Knowledge Graph Address</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Regional signals embedded directly into Schema.org Person, ICBM, and Dublin Core tags.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Location / Placename"
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
    </div>
  );
}
