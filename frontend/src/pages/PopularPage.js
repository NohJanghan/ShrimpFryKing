import React from 'react';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';

function PopularPage({ articles, setPage, setSelectedNews, currentPage, setCurrentPage, totalPages }) {
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
    <section className="popular-section">
      <h2 className="popular-title">인기 기사</h2>
      <div className="popular-list">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            title={article.title}
            brief={article.brief}
            imageURL={article.imageURL}
            likes={article.likes}
            dislikes={article.dislikes}
            onClick={() => handleNewsClick(article.id)}
            horizontal
          />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </section>
  );
}

export default PopularPage;
