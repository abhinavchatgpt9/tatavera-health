'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search as SearchIcon, Inbox } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';

export type Column<T> = {
  /** Unique key for React and for nothing else. */
  key: string;
  header: string;
  align?: 'left' | 'right';
  /** Cell contents. */
  render: (row: T) => ReactNode;
  /** Hide below the `md` breakpoint — use for secondary columns. */
  hideOnMobile?: boolean;
};

export type TableFilter<T> = {
  label: string;
  options: Array<{ value: string; label: string }>;
  /** Return true to keep the row. Not called when the value is 'ALL'. */
  matches: (row: T, value: string) => boolean;
};

type Props<T> = {
  rows: T[];
  columns: Array<Column<T>>;
  /** Fields concatenated and matched against the search box. */
  searchIn?: (row: T) => string;
  searchPlaceholder?: string;
  filter?: TableFilter<T>;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Rendered above the table, right of the search controls. */
  toolbar?: ReactNode;
  /** Shown under the heading, e.g. "8 of 12 leads". */
  onCountChange?: never;
  /** When set, rows become clickable (and keyboard-focusable) — e.g. to open a details modal. */
  onRowClick?: (row: T) => void;
};

/**
 * Client-side searchable, filterable table shared by every portal.
 *
 * Rows are passed in already fetched and serialised by a Server Component, so
 * this does no data loading of its own — it only handles the interaction that
 * has to live in the browser. Datasets here are per-user and small (a case
 * manager's leads, a hospital's doctors), so filtering in memory is the right
 * trade; if a list ever grows past a few hundred rows, move the filter into the
 * query rather than paginating here.
 */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchIn,
  searchPlaceholder = 'Search…',
  filter,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Rows will appear here as soon as there is data.',
  toolbar,
  onRowClick,
}: Props<T>) {
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('ALL');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query || !searchIn || searchIn(row).toLowerCase().includes(query);
      const matchesFilter = !filter || filterValue === 'ALL' || filter.matches(row, filterValue);
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filterValue, searchIn, filter]);

  const hasControls = Boolean(searchIn || filter || toolbar);

  return (
    <div>
      {hasControls && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          {searchIn && (
            <div className="relative flex-1">
              <SearchIcon
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {filter && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="sm:w-56" aria-label={filter.label}>
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {toolbar}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} of {rows.length} rows shown
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
          title={rows.length === 0 ? emptyTitle : 'No rows match your filters'}
          description={rows.length === 0 ? emptyDescription : 'Try a different search term or filter.'}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={[
                        'px-5 py-3 font-medium',
                        column.align === 'right' ? 'text-right' : '',
                        column.hideOnMobile ? 'hidden md:table-cell' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    role={onRowClick ? 'button' : undefined}
                    className={[
                      'border-t border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/30',
                      onRowClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400' : '',
                    ].join(' ')}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={[
                          'px-5 py-3 align-top',
                          column.align === 'right' ? 'text-right' : '',
                          column.hideOnMobile ? 'hidden md:table-cell' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
