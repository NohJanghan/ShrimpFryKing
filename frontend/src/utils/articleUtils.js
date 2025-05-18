import { ARTICLES_PER_PAGE, CATEGORY_MAP } from '../constants';

export const sortPopularArticles = (articles) => {
  if (!Array.isArray(articles)) return [];
  return [...articles].sort((a, b) => {
    const scoreA = (a.likes ?? 0) + (a.dislikes ?? 0);
    const scoreB = (b.likes ?? 0) + (b.dislikes ?? 0);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return (b.id ?? 0) - (a.id ?? 0);
  });
};

export const sortLatestArticles = (articles) => {
  if (!Array.isArray(articles)) return [];
  return [...articles].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
};

export const getPaginatedArticles = (articles, currentPage) => {
  if (!Array.isArray(articles)) return { paginatedArticles: [], totalPages: 1 };
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const paginatedSlice = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );
  return {
    paginatedArticles: paginatedSlice,
    totalPages: totalPages > 0 ? totalPages : 1,
  };
};

export const getThemeArticles = (allThemeArticles, themePageName) => {
  if (!themePageName || !allThemeArticles) return [];
  const mappedCategory = CATEGORY_MAP[themePageName] || 'Etc';
  return allThemeArticles[mappedCategory] || [];
};
