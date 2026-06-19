import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders prev, pager and next by default', () => {
    render(<Pagination total={50} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    // 50 / 10 = 5 pages
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('derives the page count from total and pageSize', () => {
    render(<Pagination total={100} pageSize={20} />);
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 6' })).not.toBeInTheDocument();
  });

  it('marks the current page active', () => {
    render(<Pagination total={50} defaultCurrentPage={3} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass('is-active');
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('changes page on pager click (uncontrolled)', async () => {
    const onCurrentChange = vi.fn();
    render(<Pagination total={50} onCurrentChange={onCurrentChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onCurrentChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass('is-active');
  });

  it('advances with the next button', async () => {
    const onCurrentChange = vi.fn();
    render(<Pagination total={50} onCurrentChange={onCurrentChange} />);
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(onCurrentChange).toHaveBeenCalledWith(2);
  });

  it('disables prev on the first page and next on the last', async () => {
    render(<Pagination total={50} defaultCurrentPage={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('does not update internal state when currentPage is controlled', async () => {
    const onCurrentChange = vi.fn();
    render(<Pagination total={50} currentPage={2} onCurrentChange={onCurrentChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onCurrentChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveClass('is-active');
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [page, setPage] = useState(1);
      return <Pagination total={50} currentPage={page} onCurrentChange={setPage} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass('is-active');
  });

  it('renders the total when requested', () => {
    render(<Pagination total={42} layout="total, prev, pager, next" />);
    expect(screen.getByText('Total 42')).toBeInTheDocument();
  });

  it('renders a size select and fires onSizeChange', async () => {
    const onSizeChange = vi.fn();
    render(
      <Pagination total={100} layout="sizes, prev, pager, next" onSizeChange={onSizeChange} />,
    );
    const select = screen.getByLabelText('Page size');
    await userEvent.selectOptions(select, '20');
    expect(onSizeChange).toHaveBeenCalledWith(20);
  });

  it('recomputes pages when the page size changes (uncontrolled)', async () => {
    render(<Pagination total={100} layout="sizes, prev, pager, next" />);
    // 100 / 10 = 10 pages initially
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Page size'), '50');
    // 100 / 50 = 2 pages
    expect(screen.queryByRole('button', { name: 'Page 10' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
  });

  it('jumps to a page via the jumper input', async () => {
    const onCurrentChange = vi.fn();
    render(
      <Pagination
        total={100}
        layout="prev, pager, next, jumper"
        onCurrentChange={onCurrentChange}
      />,
    );
    const input = screen.getByLabelText('Go to page');
    await userEvent.type(input, '4{Enter}');
    expect(onCurrentChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis jump buttons for large page counts', () => {
    render(<Pagination total={1000} defaultCurrentPage={1} />);
    // First, last and the next-more ellipsis should be present.
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 100' })).toBeInTheDocument();
    expect(screen.getByLabelText('Next pages')).toBeInTheDocument();
  });

  it('jumps forward by five via the next-more ellipsis', async () => {
    const onCurrentChange = vi.fn();
    render(<Pagination total={1000} defaultCurrentPage={1} onCurrentChange={onCurrentChange} />);
    await userEvent.click(screen.getByLabelText('Next pages'));
    expect(onCurrentChange).toHaveBeenCalledWith(6);
  });

  it('does not render a spurious next-more when the window reaches the last page', () => {
    // pageCount = 100/10 = 10, current = 7 -> EP renders [1, prev-more, 5..9, 10]
    // with NO trailing ellipsis between page 9 and the last page 10.
    render(<Pagination total={100} defaultCurrentPage={7} />);
    expect(screen.getByLabelText('Previous pages')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next pages')).not.toBeInTheDocument();
    for (const page of [5, 6, 7, 8, 9]) {
      expect(screen.getByRole('button', { name: `Page ${page}` })).toBeInTheDocument();
    }
    // The last page is adjacent to page 9.
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 4' })).not.toBeInTheDocument();
  });

  it('renders a prev-more ellipsis but no leading skipped page near the end', () => {
    render(<Pagination pageCount={10} total={0} defaultCurrentPage={10} />);
    expect(screen.getByLabelText('Previous pages')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next pages')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveClass('is-active');
  });

  it('shows ellipsis on both sides for a middle page', () => {
    render(<Pagination pageCount={10} total={0} defaultCurrentPage={5} />);
    expect(screen.getByLabelText('Previous pages')).toBeInTheDocument();
    expect(screen.getByLabelText('Next pages')).toBeInTheDocument();
    for (const page of [3, 4, 5, 6, 7]) {
      expect(screen.getByRole('button', { name: `Page ${page}` })).toBeInTheDocument();
    }
  });

  it('honours a custom pagerCount collapse threshold', () => {
    // pagerCount = 5, pageCount = 10, current = 1 -> [1, 2, 3, 4, next-more, 10]
    render(<Pagination pageCount={10} total={0} pagerCount={5} defaultCurrentPage={1} />);
    expect(screen.getByLabelText('Next pages')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
    // Page 5 is collapsed behind the ellipsis at this width.
    expect(screen.queryByRole('button', { name: 'Page 5' })).not.toBeInTheDocument();
  });

  it('does not collapse when pageCount is within pagerCount', () => {
    render(<Pagination pageCount={7} total={0} />);
    expect(screen.queryByLabelText('Next pages')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous pages')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 7' })).toBeInTheDocument();
  });

  it('respects an explicit pageCount', () => {
    render(<Pagination pageCount={3} total={0} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 4' })).not.toBeInTheDocument();
  });

  it('hides on a single page when hideOnSinglePage is set', () => {
    const { container } = render(<Pagination total={5} hideOnSinglePage />);
    expect(container.querySelector('.ec-pagination')).not.toBeInTheDocument();
  });

  it('does not navigate when disabled', async () => {
    const onCurrentChange = vi.fn();
    render(<Pagination total={50} disabled onCurrentChange={onCurrentChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onCurrentChange).not.toHaveBeenCalled();
  });

  it('applies background and small modifier classes', () => {
    const { container } = render(<Pagination total={50} background small />);
    const root = container.querySelector('.ec-pagination');
    expect(root).toHaveClass('is-background');
    expect(root).toHaveClass('is-small');
  });

  it('renders every <ul> with only <li> element children (axe-core list rule)', () => {
    // A <ul>/<ol> must directly contain only <li> elements; otherwise axe-core
    // raises a serious `list` violation. Exercise a large page count so the
    // pager renders numbers and both ellipsis "more" buttons, then assert every
    // direct element child of every <ul> is an <li>.
    const { container } = render(
      <Pagination
        total={1000}
        defaultCurrentPage={50}
        layout="total, sizes, prev, pager, next, jumper"
      />,
    );
    const lists = container.querySelectorAll('ul');
    expect(lists.length).toBeGreaterThan(0);
    for (const list of lists) {
      for (const child of Array.from(list.children)) {
        expect(child.tagName).toBe('LI');
      }
    }
  });
});
