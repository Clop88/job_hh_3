import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { store } from './store';
import { theme } from './theme';
import { VacanciesPage } from './pages/VacanciesPage';
import { VacancyDetailPage } from './pages/VacancyDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/vacancies/moscow" replace />} />
            <Route path="/vacancies/:city" element={<VacanciesPage />} />
            <Route path="/vacancies/:city/:id" element={<VacancyDetailPage />} />
            <Route path="*" element={<NotFoundPage />} /> 
          </Routes>
        </HashRouter>
      </MantineProvider>
    </Provider>
  );
}

export default App;