/**
 * Tests for layout components.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BreadcrumbsPanel from '../BreadcrumbsPanel';
import Pagination from '../Pagination';
import PageLink from '../PageLink';
import { Tabs, Tab } from '../Tabs';

describe('BreadcrumbsPanel', () => {
  const defaultProps = {
    processDefinitionId: 'process-def-123',
    processDefinitionName: 'My Process',
    processInstanceId: 'instance-456',
  };

  describe('rendering', () => {
    it('should render Dashboard link', () => {
      render(<BreadcrumbsPanel {...defaultProps} />);

      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '#/');
    });

    it('should render Processes link', () => {
      render(<BreadcrumbsPanel {...defaultProps} />);

      const processesLink = screen.getByRole('link', { name: 'Processes' });
      expect(processesLink).toBeInTheDocument();
      expect(processesLink).toHaveAttribute('href', '#/processes/');
    });

    it('should render process definition link with correct href', () => {
      render(<BreadcrumbsPanel {...defaultProps} />);

      const processLink = screen.getByRole('link', { name: 'My Process' });
      expect(processLink).toBeInTheDocument();
      expect(processLink).toHaveAttribute('href', '#/process-definition/process-def-123/runtime');
    });

    it('should display process instance ID', () => {
      render(<BreadcrumbsPanel {...defaultProps} />);

      expect(screen.getByText(/instance-456/)).toBeInTheDocument();
    });

    it('should show dividers between items', () => {
      render(<BreadcrumbsPanel {...defaultProps} />);

      const dividers = screen.getAllByText('»');
      expect(dividers.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('PageLink', () => {
  describe('rendering', () => {
    it('should render label correctly', () => {
      const onPage = jest.fn();
      render(<PageLink label="Next" page={2} isActive={false} isDisabled={false} onPage={onPage} />);

      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should add active class when isActive is true', () => {
      const onPage = jest.fn();
      render(<PageLink label="5" page={5} isActive isDisabled={false} onPage={onPage} />);

      const listItem = screen.getByRole('menuitem');
      expect(listItem).toHaveClass('active');
    });

    it('should add disabled class when isDisabled is true', () => {
      const onPage = jest.fn();
      render(<PageLink label="Previous" page={0} isActive={false} isDisabled onPage={onPage} />);

      const listItem = screen.getByRole('menuitem');
      expect(listItem).toHaveClass('disabled');
    });
  });

  describe('click behavior', () => {
    it('should call onPage when clicked and not disabled', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();
      render(<PageLink label="3" page={3} isActive={false} isDisabled={false} onPage={onPage} />);

      await user.click(screen.getByText('3'));

      expect(onPage).toHaveBeenCalledWith(3);
    });

    it('should not call onPage when clicked and disabled', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();
      render(<PageLink label="Previous" page={0} isActive={false} isDisabled onPage={onPage} />);

      await user.click(screen.getByText('Previous'));

      expect(onPage).not.toHaveBeenCalled();
    });
  });
});

describe('Pagination', () => {
  describe('rendering', () => {
    it('should not render when total equals or less than perPage', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={1} perPage={10} total={10} onPage={onPage} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render pagination when total exceeds perPage', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={1} perPage={10} total={25} onPage={onPage} />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should render First, Previous, Next, Last links', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={2} perPage={10} total={50} onPage={onPage} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('should render page numbers', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={1} perPage={10} total={30} onPage={onPage} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should disable First and Previous on first page', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={1} perPage={10} total={50} onPage={onPage} />);

      const firstButton = screen.getByText('First').closest('li');
      const prevButton = screen.getByText('Previous').closest('li');

      expect(firstButton).toHaveClass('disabled');
      expect(prevButton).toHaveClass('disabled');
    });

    it('should disable Next and Last on last page', () => {
      const onPage = jest.fn();
      render(<Pagination currentPage={5} perPage={10} total={50} onPage={onPage} />);

      const nextButton = screen.getByText('Next').closest('li');
      const lastButton = screen.getByText('Last').closest('li');

      expect(nextButton).toHaveClass('disabled');
      expect(lastButton).toHaveClass('disabled');
    });

    it('should call onPage with correct values when page is clicked', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();
      render(<Pagination currentPage={1} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByText('2'));

      // onPage receives (firstResult, page) = ((page-1)*perPage, page)
      expect(onPage).toHaveBeenCalledWith(10, 2);
    });

    it('should call onPage with correct values when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPage = jest.fn();
      render(<Pagination currentPage={2} perPage={10} total={50} onPage={onPage} />);

      await user.click(screen.getByText('Next'));

      expect(onPage).toHaveBeenCalledWith(20, 3);
    });
  });

  describe('page count', () => {
    it('should calculate correct number of pages', () => {
      const onPage = jest.fn();
      // 25 items, 10 per page = 3 pages
      render(<Pagination currentPage={1} perPage={10} total={25} onPage={onPage} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('4')).not.toBeInTheDocument();
    });
  });
});

describe('Tabs', () => {
  describe('rendering', () => {
    it('should render tab labels', () => {
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
          <Tab label="Tab 3">Content 3</Tab>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('should render first tab content by default', () => {
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should mark first tab as active by default', () => {
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
        </Tabs>
      );

      const tabs = screen.getAllByRole('listitem');
      expect(tabs[0]).toHaveClass('active');
      expect(tabs[1]).not.toHaveClass('active');
    });
  });

  describe('tab switching', () => {
    it('should switch to clicked tab', async () => {
      const user = userEvent.setup();
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
        </Tabs>
      );

      await user.click(screen.getByText('Tab 2'));

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should update active class when switching tabs', async () => {
      const user = userEvent.setup();
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
        </Tabs>
      );

      const tabs = screen.getAllByRole('listitem');

      await user.click(screen.getByText('Tab 2'));

      expect(tabs[0]).not.toHaveClass('active');
      expect(tabs[1]).toHaveClass('active');
    });

    it('should allow switching back and forth', async () => {
      const user = userEvent.setup();
      render(
        <Tabs>
          <Tab label="Tab 1">Content 1</Tab>
          <Tab label="Tab 2">Content 2</Tab>
        </Tabs>
      );

      // Switch to Tab 2
      await user.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();

      // Switch back to Tab 1
      await user.click(screen.getByText('Tab 1'));
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('Tab component', () => {
    it('should render its children', () => {
      render(
        <Tabs>
          <Tab label="Test Tab">
            <div data-testid="custom-content">Custom Content</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });
});
