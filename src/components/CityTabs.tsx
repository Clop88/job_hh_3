import { Tabs } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './CityTabs.module.css';

interface CityTabsProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const cities = [
  { value: 'moscow', label: 'Москва' },
  { value: 'petersburg', label: 'Санкт-Петербург' },
];

export const CityTabs = ({ value, onChange }: CityTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>(value || 'moscow');

 useEffect(() => {
    const path = location.pathname;
    if (path.includes('/vacancies/moscow')) {
      setActiveTab('moscow');
      onChange('moscow');
    } else if (path.includes('/vacancies/petersburg')) {
      setActiveTab('petersburg');
      onChange('petersburg');
    }
  }, [location.pathname]);

  const handleTabChange = (tabValue: string | null) => {
    if (!tabValue) return;
    setActiveTab(tabValue);
    onChange(tabValue);
    navigate(`/vacancies/${tabValue}`);
  };

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="unstyled"
      className={styles.tabs}
    >
      <Tabs.List grow>
        {cities.map((city) => (
          <Tabs.Tab key={city.value} value={city.value}>
            {city.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};