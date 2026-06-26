import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Container } from '@mantine/core';
import { 
  fetchVacancies, 
  setCurrentPage, 
  setSearchText, 
  setSelectedCity, 
  setSkills,
  selectVacancies,
  selectLoading,
  selectTotalPages,
  selectCurrentPage,
  selectSearchText,
  selectSelectedCity,
  selectSkills,
} from '../store/vacanciesSlice';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CityTabs } from '../components/CityTabs';

import { SkillsFilter } from '../components/SkillsFilter';
import { VacancyCard } from '../components/VacancyCard';
import { Pagination } from '../components/Pagination';
import styles from './VacanciesPage.module.css';

export const VacanciesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { city } = useParams<{ city: string }>();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const urlSkillsRef = useRef<string | null>(null);
  
  const vacancies = useAppSelector(selectVacancies);
  const loading = useAppSelector(selectLoading);
  const totalPages = useAppSelector(selectTotalPages);
  const currentPage = useAppSelector(selectCurrentPage);
  const searchText = useAppSelector(selectSearchText);
  const selectedCity = useAppSelector(selectSelectedCity);
  const skills = useAppSelector(selectSkills);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const cityMap: Record<string, string> = {
      'moscow': 'Москва',
      'petersburg': 'Санкт-Петербург',
    };
      
    if (city && cityMap[city]) {
      dispatch(setSelectedCity(cityMap[city]));
    } else if (city) {
      navigate('/vacancies/moscow', { replace: true });
    }
  }, [city, dispatch, navigate]);


  useEffect(() => {
  const hash = window.location.hash;
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  
  const params: Record<string, string> = {};
  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[key] = decodeURIComponent(value || '');
    }
  });
  
  const urlSearch = params['search'] || null;
  const urlSkills = params['skills'] || null;
  const urlPage = params['page'] || null;

  if (urlSearch !== null) dispatch(setSearchText(urlSearch));
  
  if (urlSkills !== null) {
    const skillsArray = urlSkills === '' ? [] : urlSkills.split(',');
    urlSkillsRef.current = urlSkills;
    dispatch(setSkills(skillsArray));
  }
    
  if (urlPage !== null) {
    const pageNumber = parseInt(urlPage, 10);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      dispatch(setCurrentPage(pageNumber));
    }
  }
  
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsInitialized(true);
}, []);

  
  useEffect(() => {
    if (!isInitialized) return;
    
    if (isFirstLoad.current && skills.length === 0) {
    const defaultSkills = ['JavaScript', 'React', 'Redux', 'ReduxToolkit', 'Nextjs'];
    dispatch(setSkills(defaultSkills));
    isFirstLoad.current = false;
    return;
    }
    

    isFirstLoad.current = false;

    const params = new URLSearchParams();
    if (searchText) params.set('search', searchText);
    params.set('skills', skills.join(','));
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const newUrl = `/vacancies/${city || 'moscow'}?${params.toString()}`;
    const currentHash = window.location.hash.replace('#', '');
    
    if (currentHash === newUrl) return;
    
    navigate(newUrl, { replace: true });
  }, [searchText, skills, currentPage, navigate, isInitialized, city]);

  
  useEffect(() => {
    if (!isInitialized) return;
    
    dispatch(fetchVacancies());
  }, [dispatch, currentPage, searchText, selectedCity, skills, isInitialized]);

  const handleCityChange = (value: string | null) => {
    dispatch(setSelectedCity(value));
    };
  

  const handleSearchChange = (value: string) => {
    dispatch(setSearchText(value));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    dispatch(setSkills(newSkills));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.divider}></div>
      <Container className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <h1 className={styles.title}>Список вакансий</h1>
            <p className={styles.subtitle}>по профессии Frontend-разработчик</p>
          </div>
          <div className={styles.filtersRow}>
            <SearchBar value={searchText} onChange={handleSearchChange} />
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.leftsection}>
            <div className={styles.moduleskills}>
              <SkillsFilter skills={skills} onSkillsChange={handleSkillsChange} />
            </div>
            
          </div>

          <div className={styles.rightsection}>
            
              <CityTabs value={city || 'moscow'} onChange={handleCityChange} />
            
            {loading ? (
              <div className={styles.loaderWrapper}>
                <div className={styles.loader} />
              </div>
            ) : vacancies.length === 0 ? (
              <div className={styles.emptyWrapper}>
                <p className={styles.emptyText}>Вакансии не найдены</p>
                <p className={styles.emptySubtext}>Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <>
                <div className={styles.vacanciesList}>
                  {vacancies.map((vacancy) => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <Pagination total={totalPages} current={currentPage} onChange={handlePageChange} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};