import { describe, it, expect } from 'vitest';
import { paginate, parsePage, parseSort, pageWindow, DIRECTORY_MAX_RESULTS } from '@/lib/hospital-directory';

describe('paginate', () => {
  it('handles 0 records', () => {
    expect(paginate(0, 1)).toMatchObject({ total: 0, totalPages: 1, page: 1, from: 0, to: 0, take: 0 });
  });
  it('1 record', () => expect(paginate(1, 1)).toMatchObject({ totalPages: 1, from: 1, to: 1, take: 1 }));
  it('10 records fit one page', () => expect(paginate(10, 1)).toMatchObject({ totalPages: 1, from: 1, to: 10 }));
  it('11 records need two pages, second has one row', () => {
    expect(paginate(11, 2)).toMatchObject({ totalPages: 2, from: 11, to: 11, skip: 10, take: 1 });
  });
  it('37 results -> four pages, page 2 shows 11-20', () => {
    expect(paginate(37, 2)).toMatchObject({ totalPages: 4, from: 11, to: 20 });
  });
  it('caps at 100 and 10 pages', () => {
    const p = paginate(250, 10);
    expect(p).toMatchObject({ total: DIRECTORY_MAX_RESULTS, totalPages: 10, from: 91, to: 100 });
  });
  it('clamps out-of-range pages', () => {
    expect(paginate(37, 99).page).toBe(4);
    expect(paginate(37, 0).page).toBe(1);
  });
});

describe('parsing', () => {
  it('invalid page values become 1', () => {
    for (const v of [undefined, '', 'abc', '-3', '0', 'NaN']) expect(parsePage(v)).toBe(1);
    expect(parsePage('3')).toBe(3);
  });
  it('sort defaults to published rank', () => {
    expect(parseSort('city')).toBe('city');
    expect(parseSort('name')).toBe('name');
    expect(parseSort('rating')).toBe('rank');
  });
});

describe('pageWindow', () => {
  it('shows all pages when few', () => expect(pageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]));
  it('collapses with ellipses', () => expect(pageWindow(5, 10)).toEqual([1, '…', 4, 5, 6, '…', 10]));
  it('no gap marker next to the ends', () => expect(pageWindow(2, 10)).toEqual([1, 2, 3, '…', 10]));
});

import { buildProcedureEntries, getProcedureRankings, PROCEDURE_SPECIALTIES } from '@/lib/hospital-directory';
import { PROCEDURES } from '@/lib/constants';
import { RANKED_HOSPITALS, SPECIALTY_RANKS } from '@/lib/hospital-rankings-data';

describe('ranking data integrity', () => {
  it('has 97 India overall ranks, 1..97 with no gaps or duplicates', () => {
    const ranks = RANKED_HOSPITALS.filter((h) => h.overallRank !== null).map((h) => h.overallRank);
    expect(ranks).toEqual(Array.from({ length: 97 }, (_, i) => i + 1));
    expect(new Set(RANKED_HOSPITALS.map((h) => h.id)).size).toBe(RANKED_HOSPITALS.length);
  });
  it('every specialty rank points at a known hospital', () => {
    const ids = new Set(RANKED_HOSPITALS.map((h) => h.id));
    for (const set of Object.values(SPECIALTY_RANKS)) for (const r of set.ranks) expect(ids.has(r.hospitalId)).toBe(true);
  });
  it('every procedure has a directory config', () => {
    for (const p of PROCEDURES) expect(PROCEDURE_SPECIALTIES[p.slug]).toBeDefined();
  });
});

describe('procedure directories', () => {
  it('CABG puts the best cardiac-surgery rank first and keeps unique rows', () => {
    const { entries } = buildProcedureEntries('coronary-artery-bypass')!;
    expect(entries[0].name).toMatch(/All India Institute of Medical Sciences - Delhi/);
    expect(entries[0].specialtyRanks[0]).toEqual({ label: 'Cardiac Surgery', rank: 44 });
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
    expect(entries.length).toBeLessThanOrEqual(100);
  });
  it('knee replacement uses India overall order only', () => {
    const { entries } = buildProcedureEntries('total-knee-replacement')!;
    expect(entries.length).toBe(97);
    expect(entries.every((e) => e.specialtyRanks.length === 0)).toBe(true);
    expect(entries.map((e) => e.overallRank)).toEqual(Array.from({ length: 97 }, (_, i) => i + 1));
  });
  it('pages hold ten rows and the last page holds the remainder', () => {
    const p1 = getProcedureRankings('total-knee-replacement', { page: 1, sort: 'rank' })!;
    expect(p1.entries).toHaveLength(10);
    const p10 = getProcedureRankings('total-knee-replacement', { page: 10, sort: 'rank' })!;
    expect(p10.pageInfo).toMatchObject({ totalPages: 10, from: 91, to: 97 });
    expect(p10.entries).toHaveLength(7);
  });
  it('city filter narrows the count and unknown city is ignored', () => {
    const m = getProcedureRankings('total-knee-replacement', { page: 1, city: 'Mumbai', sort: 'rank' })!;
    expect(m.entries.every((e) => e.city === 'Mumbai')).toBe(true);
    const all = getProcedureRankings('total-knee-replacement', { page: 1, city: 'Atlantis', sort: 'rank' })!;
    expect(all.pageInfo.total).toBe(97);
  });
  it('unknown procedure returns null', () => expect(getProcedureRankings('nope', { page: 1, sort: 'rank' })).toBeNull());
});
