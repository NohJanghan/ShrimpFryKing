import React from 'react';
import NewsCard from '../components/NewsCard';
import ThemeCard from '../components/ThemeCard';
import { THEME_CATEGORIES } from '../constants';

function MainPage({ popularArticles, latestArticles, setPage, setSelectedNews, setThemePage }) {
  const handleNewsClick = async (articleId) => {
    try {
      const res = await fetch(`/news/${articleId}`, { credentials: 'include' });
      const detail = await res.json();
      setSelectedNews(detail);
      setPage('newsDetail');
    } catch (e) {
      alert('뉴스 상세 정보를 불러오지 못했습니다.');
    }
  };

  return (
    <>
      <section className="section" id="popular">
        <button className="section-link" onClick={() => setPage('popular')}>
          <div className="section-title">
            <span className="main-title">인기순🔥</span>
            <span className="sub-title">popularity</span>
          </div>
        </button>
        <div className="card-grid">
          {popularArticles.slice(0, 3).map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              brief={article.brief}
              imageURL={article.imageURL}
              likes={article.likes}
              dislikes={article.dislikes}
              onClick={() => handleNewsClick(article.id)}
            />
          ))}
        </div>
      </section>
      <hr className="section-divider" />
      <section className="section" id="latest">
        <button className="section-link" onClick={() => setPage('latest')}>
          <div className="section-title">
            <span className="main-title">최신순✨</span>
            <span className="sub-title">latest</span>
          </div>
        </button>
        <div className="card-grid">
          {latestArticles.slice(0, 3).map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              brief={article.brief}
              imageURL={article.imageURL}
              likes={article.likes}
              dislikes={article.dislikes}
              onClick={() => handleNewsClick(article.id)}
            />
          ))}
        </div>
      </section>
      <hr className="section-divider" />
      <section className="section" id="theme">
        <div className="section-title">
          <span className="main-title">주제📚</span>
          <span className="sub-title">theme</span>
        </div>
        <div className="card-grid theme-grid">
          {THEME_CATEGORIES.map(theme => (
             <ThemeCard
                key={theme}
                category={theme === '과학' ? 'Science/Tech' : theme === '경제' ? 'Economy' : theme === '기타' ? 'Etc' : 'Politics'}
                label={theme}
                onClick={() => { setThemePage(theme); setPage('theme'); }} />
          ))}
        </div>
      </section>
    </>
  );
}

export default MainPage;