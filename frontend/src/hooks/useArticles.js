import { useState, useEffect, useCallback } from 'react';
import { fetchArticles as fetchArticlesService } from '../services/articleService';

const useArticles = (setUser) => {
  const [popularArticles, setPopularArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [themeArticles, setThemeArticles] = useState({
    'Politics': [],
    'Science/Tech': [],
    'Economy': [],
    'Etc': [],
  });

  const loadArticles = useCallback(() => {
    fetchArticlesService(setPopularArticles, setLatestArticles, setThemeArticles, setUser);
  }, [setUser]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return { popularArticles, latestArticles, themeArticles, refreshArticles: loadArticles };
};

export default useArticles;
