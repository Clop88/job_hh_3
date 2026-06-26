import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import { CityTabs } from '../components/CityTabs';

describe('CityTabs', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <MantineProvider>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </MantineProvider>
    );
  };

  it('отображает кнопки Москва и Санкт-Петербург', () => {
    renderWithProviders(<CityTabs value="moscow" onChange={() => {}} />);
    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('Санкт-Петербург')).toBeInTheDocument();
  });

  it('вызывает onChange при клике на город', async () => {
    const mockOnChange = vi.fn();
    renderWithProviders(<CityTabs value="moscow" onChange={mockOnChange} />);
    
    const petersburgBtn = screen.getByText('Санкт-Петербург');
    await userEvent.click(petersburgBtn);
    
    expect(mockOnChange).toHaveBeenCalledWith('petersburg');
  });

  it('активный город имеет класс tabActive', () => {
    renderWithProviders(<CityTabs value="moscow" onChange={() => {}} />);
    const activeTab = screen.getByText('Москва');
    expect(activeTab.closest('[data-active]')).toBeTruthy();
  });
});