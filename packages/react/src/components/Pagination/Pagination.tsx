import {
  type ChangeEvent,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Icon } from '../Icon';

export type PaginationLayoutItem = 'prev' | 'pager' | 'next' | 'total' | 'sizes' | 'jumper';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Total number of items. */
  total?: number;
  /** Items per page (controlled). */
  pageSize?: number;
  /** Initial items per page (uncontrolled). */
  defaultPageSize?: number;
  /** Current page (controlled), 1-based. */
  currentPage?: number;
  /** Initial current page (uncontrolled), 1-based. */
  defaultCurrentPage?: number;
  /** Options offered by the page-size selector. */
  pageSizes?: number[];
  /** Explicit page count; overrides the value derived from `total`/`pageSize`. */
  pageCount?: number;
  /** Number of page buttons shown before the pager collapses into ellipses. Odd value >= 5. Default `7`. */
  pagerCount?: number;
  /** Comma-separated, ordered list of layout pieces to render. */
  layout?: string;
  /** Use the rounded background button style. */
  background?: boolean;
  /** Render the compact variant. */
  small?: boolean;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Hide the pagination entirely when there is only one page. */
  hideOnSinglePage?: boolean;
  /** Fired when the active page changes. */
  onCurrentChange?: (page: number) => void;
  /** Fired when the page size changes. */
  onSizeChange?: (size: number) => void;
}

const ELLIPSIS_OFFSET = 5;

function PrevArrow() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
      />
    </svg>
  );
}

function NextArrow() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M176 416a96 96 0 1 0 0 192 96 96 0 0 0 0-192zm336 0a96 96 0 1 0 0 192 96 96 0 0 0 0-192zm336 0a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"
      />
    </svg>
  );
}

/** Build the list of page numbers and ellipsis markers, mirroring Element Plus. */
function buildPagers(
  current: number,
  pageCount: number,
  pagerCount: number,
): Array<number | 'prev-more' | 'next-more'> {
  if (pageCount <= pagerCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const halfPager = (pagerCount - 1) / 2;
  const showPrevMore = current > pagerCount - halfPager;
  const showNextMore = current < pageCount - halfPager;

  const pagers: number[] = [];
  if (showPrevMore && !showNextMore) {
    // Active window pinned to the end; only a leading ellipsis is needed.
    const startPage = pageCount - (pagerCount - 2);
    for (let i = startPage; i < pageCount; i += 1) {
      pagers.push(i);
    }
  } else if (!showPrevMore && showNextMore) {
    // Active window pinned to the start; only a trailing ellipsis is needed.
    for (let i = 2; i < pagerCount; i += 1) {
      pagers.push(i);
    }
  } else if (showPrevMore && showNextMore) {
    // Middle range: ellipsis on both sides.
    const offset = Math.floor(pagerCount / 2) - 1;
    for (let i = current - offset; i <= current + offset; i += 1) {
      pagers.push(i);
    }
  }

  return [
    1,
    ...(showPrevMore ? (['prev-more'] as const) : []),
    ...pagers,
    ...(showNextMore ? (['next-more'] as const) : []),
    pageCount,
  ];
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(function Pagination(
  props,
  ref,
) {
  const {
    total = 0,
    pageSize: pageSizeProp,
    defaultPageSize = 10,
    currentPage: currentPageProp,
    defaultCurrentPage = 1,
    pageSizes = [10, 20, 30, 40, 50, 100],
    pageCount: pageCountProp,
    pagerCount = 7,
    layout = 'prev, pager, next',
    background = false,
    small = false,
    disabled = false,
    hideOnSinglePage = false,
    onCurrentChange,
    onSizeChange,
    className,
    ...rest
  } = props;

  const ns = useNamespace('pagination');
  const pagerNs = useNamespace('pager');

  // Element Plus restricts pagerCount to odd values >= 5.
  const normalizedPagerCount = (() => {
    const value = Math.floor(pagerCount);
    if (!Number.isFinite(value) || value < 5) return 5;
    return value % 2 === 0 ? value + 1 : value;
  })();

  const sizeControlled = pageSizeProp !== undefined;
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const pageSize = sizeControlled ? pageSizeProp : internalSize;

  const computedPageCount = pageCountProp ?? Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const pageControlled = currentPageProp !== undefined;
  const [internalPage, setInternalPage] = useState(defaultCurrentPage);
  const rawCurrent = pageControlled ? currentPageProp : internalPage;
  const current = Math.min(Math.max(1, rawCurrent), computedPageCount);

  if (hideOnSinglePage && computedPageCount <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), computedPageCount);
    if (next === current || disabled) {
      return;
    }
    if (!pageControlled) {
      setInternalPage(next);
    }
    onCurrentChange?.(next);
  };

  const changeSize = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = Number(event.target.value);
    if (!sizeControlled) {
      setInternalSize(next);
    }
    onSizeChange?.(next);
  };

  const items = layout
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean) as PaginationLayoutItem[];

  const renderTotal = () => (
    <span key="total" className={ns.e('total')}>
      Total {total}
    </span>
  );

  const renderSizes = () => (
    <span key="sizes" className={ns.e('sizes')}>
      <select
        className={ns.e('size-select')}
        value={pageSize}
        disabled={disabled}
        aria-label="Page size"
        onChange={changeSize}
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size}/page
          </option>
        ))}
      </select>
    </span>
  );

  const renderPrev = () => (
    <button
      key="prev"
      type="button"
      className={ns.e('prev')}
      disabled={disabled || current <= 1}
      aria-label="Previous page"
      onClick={() => goToPage(current - 1)}
    >
      <Icon>
        <PrevArrow />
      </Icon>
    </button>
  );

  const renderNext = () => (
    <button
      key="next"
      type="button"
      className={ns.e('next')}
      disabled={disabled || current >= computedPageCount}
      aria-label="Next page"
      onClick={() => goToPage(current + 1)}
    >
      <Icon>
        <NextArrow />
      </Icon>
    </button>
  );

  const renderPager = () => {
    const pagers = buildPagers(current, computedPageCount, normalizedPagerCount);
    return (
      <ul key="pager" className={cls(pagerNs.b(), ns.is('disabled', disabled))}>
        {pagers.map((pager, index) => {
          // The interactive control lives on an inner <button> rather than the
          // <li> itself: a <ul> must only directly contain <li> elements, and
          // putting role="button" on the <li> strips its implicit listitem role
          // (an axe-core `list` violation).
          if (pager === 'prev-more' || pager === 'next-more') {
            const jump = pager === 'prev-more' ? current - ELLIPSIS_OFFSET : current + ELLIPSIS_OFFSET;
            return (
              <li key={`${pager}-${index}`} className={pagerNs.e('item')}>
                <button
                  type="button"
                  className={cls(pagerNs.e('button'), pagerNs.is('more'))}
                  aria-label={pager === 'prev-more' ? 'Previous pages' : 'Next pages'}
                  disabled={disabled}
                  onClick={() => goToPage(jump)}
                >
                  <Icon>
                    <MoreIcon />
                  </Icon>
                </button>
              </li>
            );
          }
          const isActive = pager === current;
          return (
            <li key={pager} className={pagerNs.e('item')}>
              <button
                type="button"
                className={cls(pagerNs.e('button'), pagerNs.is('active', isActive))}
                aria-label={`Page ${pager}`}
                aria-current={isActive ? 'page' : undefined}
                disabled={disabled}
                onClick={() => goToPage(pager)}
              >
                {pager}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleJump = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value) && value > 0) {
      goToPage(value);
    }
    (event.target as HTMLInputElement).value = '';
  };

  const renderJumper = () => (
    <span key="jumper" className={ns.e('jumper')}>
      Go to
      <input
        type="number"
        min={1}
        max={computedPageCount}
        className={ns.e('jumper-input')}
        disabled={disabled}
        aria-label="Go to page"
        onKeyDown={handleJump}
      />
    </span>
  );

  const renderers: Record<PaginationLayoutItem, () => React.ReactNode> = {
    total: renderTotal,
    sizes: renderSizes,
    prev: renderPrev,
    pager: renderPager,
    next: renderNext,
    jumper: renderJumper,
  };

  const classes = cls(
    ns.b(),
    ns.is('background', background),
    ns.is('small', small),
    ns.is('disabled', disabled),
    className,
  );

  return (
    <div ref={ref} className={classes} role="navigation" aria-label="Pagination" {...rest}>
      {items.map((item) => renderers[item]?.())}
    </div>
  );
});
