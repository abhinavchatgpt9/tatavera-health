import { RANKED_HOSPITALS, SPECIALTY_RANKS, SPECIALIST_MENTIONS, type SpecialtyKey } from '@/lib/hospital-rankings-data';

/** Hospitals shown per page. */
export const DIRECTORY_PAGE_SIZE = 10;
/** A procedure directory lists at most this many hospitals (10 pages of 10). */
export const DIRECTORY_MAX_RESULTS = 100;

export type DirectorySort = 'rank' | 'name' | 'city';

export function parseSort(value: string | undefined): DirectorySort {
  return value === 'city' || value === 'name' ? value : 'rank';
}

/** Turns a ?page= value into a positive integer; anything invalid becomes 1. */
export function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export type PageInfo = {
  total: number;
  totalPages: number;
  page: number;
  from: number; // 1-based index of first row on the page (0 when empty)
  to: number;
  skip: number;
  take: number;
};

/** Pure pagination maths: counts are capped at DIRECTORY_MAX_RESULTS and the page is clamped into range. */
export function paginate(rawTotal: number, requestedPage: number, pageSize = DIRECTORY_PAGE_SIZE): PageInfo {
  const total = Math.min(Math.max(0, rawTotal), DIRECTORY_MAX_RESULTS);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const skip = (page - 1) * pageSize;
  const take = Math.max(0, Math.min(pageSize, total - skip));
  return { total, totalPages, page, from: total === 0 ? 0 : skip + 1, to: skip + take, skip, take };
}

/** Compact page list for the pager, e.g. [1, '…', 4, 5, 6, '…', 10]. */
export function pageWindow(page: number, totalPages: number): Array<number | '…'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: Array<number | '…'> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

/**
 * Which published specialty lists give context for each procedure (slugs match PROCEDURES in lib/constants.ts).
 * A specialty rank is context only, never a rank for the procedure itself. Empty means no published
 * Indian specialty rank was found for that procedure (checked 18 November 2026).
 */
export const PROCEDURE_SPECIALTIES: Record<string, { specialties: SpecialtyKey[]; note: string }> = {
  'coronary-artery-bypass': { specialties: ['cardiac-surgery', 'cardiology'], note: 'Cardiac Surgery and Cardiology ranks are shown as context. Neither is a CABG-specific rank.' },
  'total-knee-replacement': { specialties: [], note: 'Newsweek / Statista lists no Indian hospital in its Orthopedics ranking, so no orthopedic rank is shown.' },
  'liver-transplant': { specialties: ['gastroenterology'], note: 'The Gastroenterology rank is shown as context. No transplant-specific ranking was found.' },
  'ivf-treatment': { specialties: [], note: 'No IVF ranking from a recognised agency was found. Fertility clinics are registered with the National ART Registry, which is not a ranking.' },
  'hair-transplant': { specialties: [], note: 'No ranking exists for hair transplant. FUE is mostly done in specialist clinics, so confirm that the hospital offers it.' },
  'spine-surgery': { specialties: ['neurosurgery'], note: 'The Neurosurgery rank is shown as context. It is not a spinal fusion (TLIF/PLIF) rank.' },
};

export type DirectoryEntry = {
  id: string;
  name: string;
  city: string;
  overallRank: number | null;
  overallScore: number | null;
  specialtyRanks: Array<{ label: string; rank: number }>;
  /** Set for specialist hospitals the publisher lists without a rank. */
  specialistMention: string | null;
};

export type ProcedureRankings = {
  cities: string[];
  entries: DirectoryEntry[];
  pageInfo: PageInfo;
  specialtyNote: string;
  hasSpecialtyContext: boolean;
};

/** Builds the full ordered list for a procedure: specialty-ranked hospitals first, then the rest by India overall rank. */
export function buildProcedureEntries(slug: string): { entries: DirectoryEntry[]; note: string; hasSpecialty: boolean } | null {
  const cfg = PROCEDURE_SPECIALTIES[slug];
  if (!cfg) return null;

  const byId = new Map(RANKED_HOSPITALS.map((h) => [h.id, h]));
  const specRanks = new Map<string, Array<{ label: string; rank: number; order: number }>>();
  cfg.specialties.forEach((key, order) => {
    const set = SPECIALTY_RANKS[key];
    set.ranks.forEach(({ hospitalId, rank }) => {
      const list = specRanks.get(hospitalId) ?? [];
      list.push({ label: set.label, rank, order });
      specRanks.set(hospitalId, list);
    });
  });

  const mentions = new Map(SPECIALIST_MENTIONS.map((m) => [m.hospitalId, m.specialty]));
  const toEntry = (id: string): DirectoryEntry => {
    const h = byId.get(id)!;
    const sr = (specRanks.get(id) ?? []).sort((a, b) => a.order - b.order);
    return {
      id: h.id,
      name: h.name,
      city: h.city,
      overallRank: h.overallRank,
      overallScore: h.overallScore,
      specialtyRanks: sr.map(({ label, rank }) => ({ label, rank })),
      specialistMention: h.overallRank === null && sr.length === 0 ? mentions.get(id) ?? null : null,
    };
  };

  const specialtyFirst = [...specRanks.keys()]
    .map(toEntry)
    .sort((a, b) => {
      const sa = specRanks.get(a.id)!.sort((x, y) => x.order - y.order)[0];
      const sb = specRanks.get(b.id)!.sort((x, y) => x.order - y.order)[0];
      return sa.order - sb.order || sa.rank - sb.rank || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
    });
  const rest = RANKED_HOSPITALS.filter((h) => h.overallRank !== null && !specRanks.has(h.id))
    .sort((a, b) => a.overallRank! - b.overallRank!)
    .map((h) => toEntry(h.id));

  return { entries: [...specialtyFirst, ...rest], note: cfg.note, hasSpecialty: cfg.specialties.length > 0 };
}

/** Filter -> sort -> count -> slice. Ties break on name, then id, so pages never shuffle. */
export function getProcedureRankings(
  slug: string,
  opts: { page: number; city?: string; sort: DirectorySort },
): ProcedureRankings | null {
  const built = buildProcedureEntries(slug);
  if (!built) return null;

  const cities = [...new Set(built.entries.map((e) => e.city))].sort((a, b) => a.localeCompare(b));
  const city = opts.city && cities.includes(opts.city) ? opts.city : undefined;
  let list = city ? built.entries.filter((e) => e.city === city) : built.entries.slice();

  if (opts.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  if (opts.sort === 'city') list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  // 'rank' keeps the order from buildProcedureEntries.

  const pageInfo = paginate(list.length, opts.page);
  return {
    cities,
    entries: list.slice(pageInfo.skip, pageInfo.skip + pageInfo.take),
    pageInfo,
    specialtyNote: built.note,
    hasSpecialtyContext: built.hasSpecialty,
  };
}
