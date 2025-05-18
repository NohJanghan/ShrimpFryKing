import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import PopularPage from './pages/PopularPage';
import LatestPage from './pages/LatestPage';
import ThemePage from './pages/ThemePage';
import WritePage from './WritePage';
import NewsDetailPage from './NewsDetailPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import useArticles from './hooks/useArticles';
import {
  sortPopularArticles,
  sortLatestArticles,
  getPaginatedArticles,
  getThemeArticles,
} from './utils/articleUtils';

function App() {
  const [page, setPage] = useState('main');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [themePage, setThemePage] = useState(null); // '정치', '과학', '경제', '기타'
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPopularPage, setCurrentPopularPage] = useState(1);
  const [currentLatestPage, setCurrentLatestPage] = useState(1);
  const [currentThemePageNum, setCurrentThemePageNum] = useState(1);
  const [user, setUser] = useState(null);

  const { popularArticles, latestArticles, themeArticles, refreshArticles } = useArticles(setUser);

  const sortedPopular = sortPopularArticles(popularArticles);
  const { paginatedArticles: currentPopularArticlesSlice, totalPages: totalPopularPages } = getPaginatedArticles(sortedPopular, currentPopularPage);

  const sortedLatest = sortLatestArticles(latestArticles);
  const { paginatedArticles: currentLatestArticlesSlice, totalPages: totalLatestPages } = getPaginatedArticles(sortedLatest, currentLatestPage);

  const currentThemeArticlesList = getThemeArticles(themeArticles, themePage);
  const { paginatedArticles: currentThemeArticlesSlice, totalPages: totalThemePages } = getPaginatedArticles(currentThemeArticlesList, currentThemePageNum);

  const renderPage = () => {
    switch (page) {
      case 'main':
        return <MainPage
                  popularArticles={sortedPopular}
                  latestArticles={sortedLatest}
                  setPage={setPage}
                  setSelectedNews={setSelectedNews}
                  setThemePage={setThemePage}
                />;
      case 'popular':
        return <PopularPage
                  articles={currentPopularArticlesSlice}
                  setPage={setPage}
                  setSelectedNews={setSelectedNews}
                  currentPage={currentPopularPage}
                  setCurrentPage={setCurrentPopularPage}
                  totalPages={totalPopularPages}
                />;
      case 'latest':
        return <LatestPage
                  articles={currentLatestArticlesSlice}
                  setPage={setPage}
                  setSelectedNews={setSelectedNews}
                  currentPage={currentLatestPage}
                  setCurrentPage={setCurrentLatestPage}
                  totalPages={totalLatestPages}
                />;
      case 'theme':
        return <ThemePage
                  articles={currentThemeArticlesSlice}
                  themePage={themePage}
                  setPage={setPage}
                  setSelectedNews={setSelectedNews}
                  currentPage={currentThemePageNum}
                  setCurrentPage={setCurrentThemePageNum}
                  totalPages={totalThemePages}
                />;
      case 'write':
        return <WritePage user={user} setPage={setPage} fetchArticles={refreshArticles} />;
      case 'newsDetail':
        return <NewsDetailPage news={selectedNews} user={user} setSelectedNews={setSelectedNews} fetchArticles={refreshArticles} setPage={setPage} />;
      case 'login':
        return <LoginPage setUser={setUser} setPage={setPage} />;
      case 'register':
        return <RegisterPage setUser={setUser} setPage={setPage} />;
      default:
        return <MainPage popularArticles={sortedPopular} latestArticles={sortedLatest} setPage={setPage} setSelectedNews={setSelectedNews} setThemePage={setThemePage} />;
    }
  };

  return (
    <div className="App">
      <Header
        page={page}
        setPage={setPage}
        user={user}
        setUser={setUser}
        showThemeMenu={showThemeMenu}
        setShowThemeMenu={setShowThemeMenu}
        setThemePage={setThemePage}
      />
      <hr className="header-divider" />
      <main className="content" style={page === 'newsDetail'
        ? { paddingTop: '80px', height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', flexDirection: 'row' }
        : { paddingTop: '80px', margin: 0, overflowY: 'auto', height: 'calc(100vh - 80px)'}
      }>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;