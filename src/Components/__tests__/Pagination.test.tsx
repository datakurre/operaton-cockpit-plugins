/**
 * Tests for Pagination component.
 *
 * Tests page navigation, boundary conditions, and callback behavior.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  describe('rendering', () => {
    it('should not render when total is zero', () => {
      render(<Pagination currentPage={1} perPage={10} total={0} onPage={jest.fn()} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should not render when total is less than perPage', () => {
      render(<Pagination currentPage={1} perPage={10} total={5} onPage={jest.fn()} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render pagination when total exceeds perPage', () => {
      render(<Pagination currentPage={1} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should render First, Previous, Next, Last links', () => {
      render(<Pagination currentPage={2} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Last' })).toBeInTheDocument();
    });

    it('should render page number links', () => {
      render(<Pagination currentPage={1} perPage={10} total={30} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('should mark current page as active', () => {
      render(<Pagination currentPage={2} perPage={10} total={50} onPage={jest.fn()} />);

      const pageTwo = screen.getByRole('button', { name: '2' });
      expect(pageTwo.closest('li')).toHaveClass('active');
    });
  });

  describe('boundary conditions', () => {
    it('should disable First and Previous on first page', () => {
      render(<Pagination currentPage={1} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'First' }).closest('li')).toHaveClass('disabled');
      expect(screen.getByRole('button', { name: 'Previous' }).closest('li')).toHaveClass('disabled');
    });

    it('should enable First and Previous on non-first page', () => {
      render(<Pagination currentPage={2} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'First' }).closest('li')).not.toHaveClass('disabled');
      expect(screen.getByRole('button', { name: 'Previous' }).closest('li')).not.toHaveClass('disabled');
    });

    it('should disable Next and Last on last page', () => {
      render(<Pagination currentPage={5} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'Next' }).closest('li')).toHaveClass('disabled');
      expect(screen.getByRole('button', { name: 'Last' }).closest('li')).toHaveClass('disabled');
    });

    it('should enable Next and Last on non-last page', () => {
      render(<Pagination currentPage={3} perPage={10} total={50} onPage={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'Next' }).closest('li')).not.toHaveClass('disabled');
      expect(screen.getByRole('button', { name: 'Last' }).closest('li')).not.toHaveClass('disabled');
    });
  });

  describe('page range calculation', () => {
    it('should show limited number of pages based on showPages prop', () => {
      render(<Pagination currentPage={1} perPage={10} total={100} showPages={5} onPage={jest.fn()} />);

      // Should show pages 1-5 when showPages=5
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
    });

    it('should center current page in range when possible', () => {
      render(<Pagination currentPage={5} perPage={10} total={100} showPages={5} onPage={jest.fn()} />);

      // When on page 5 with showPages=5, should show pages 3-7
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    });

    it('should show last pages when near end', () => {
      render(<Pagination currentPage={9} perPage={10} total={100} showPages={5} onPage={jest.fn()} />);

      // When on page 9 of 10, should show pages 6-10
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    it('should show all pages when pageCount is less than showPages', () => {
      render(<Pagination currentPage={1} perPage={10} total={30} showPages={7} onPage={jest.fn()} />);

      // Only 3 pages, so show all 3
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });
  });

  describe('navigation callbacks', () => {
    it('should call onPage with correct values when clicking a page number', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={1} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: '3' }));

      // Page 3 should give firstResult=20 (2*10) and page=3
      expect(onPage).toHaveBeenCalledWith(20, 3);
    });

    it('should call onPage with correct values when clicking First', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={3} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'First' }));

      expect(onPage).toHaveBeenCalledWith(0, 1);
    });

    it('should call onPage with correct values when clicking Previous', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={3} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'Previous' }));

      // Previous from page 3 should be page 2 with firstResult=10
      expect(onPage).toHaveBeenCalledWith(10, 2);
    });

    it('should call onPage with correct values when clicking Next', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={2} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Next from page 2 should be page 3 with firstResult=20
      expect(onPage).toHaveBeenCalledWith(20, 3);
    });

    it('should call onPage with correct values when clicking Last', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={1} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'Last' }));

      // Last is page 5 with firstResult=40
      expect(onPage).toHaveBeenCalledWith(40, 5);
    });

    it('should not call onPage when clicking disabled First button', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={1} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'First' }));

      expect(onPage).not.toHaveBeenCalled();
    });

    it('should not call onPage when clicking disabled Next button', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();

      render(<Pagination currentPage={5} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(onPage).not.toHaveBeenCalled();
    });
  });

  describe('different perPage values', () => {
    it('should calculate correct page count with perPage=25', () => {
      render(<Pagination currentPage={1} perPage={25} total={100} onPage={jest.fn()} />);

      // 100 / 25 = 4 pages
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();
    });

    it('should handle non-even division correctly', () => {
      render(<Pagination currentPage={1} perPage={30} total={100} onPage={jest.fn()} />);

      // 100 / 30 = 3.33... = 4 pages
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();
    });
  });
});
