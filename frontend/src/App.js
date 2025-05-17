import React, {useState, useEffect} from 'react';
import './App.css';
import logo from './logo_with_name.png';
import thumbUpImg from './Good_hand.png';
import thumbDownImg from './Bad_hand.png';
import WritePage from './WritePage';

function App() {
  const [page, setPage] = useState('main');
  const [currentPopularPage, setCurrentPopularPage] = useState(1);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [themePage, setThemePage] = useState(null); // '정치', '과학', '경제' 중 하나
  const [popularArticles, setPopularArticles] = useState([]);
/*
  useEffect(() => {
    fetch('http://localhost:5000/api/popular')
      .then(res => res.json())
      .then(data => {
        setPopularArticles(data); // data는 NewsItemBrief[] 형태
      });
  }, []);
*/
  const articlesPerPage = 5;
  const totalPages = Math.ceil(popularArticles.length / articlesPerPage);
  const startIdx = (currentPopularPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const currentArticles = popularArticles.slice(startIdx, endIdx);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-row">
          <div className="logo">
          <button
            className="logo-btn"
            onClick={() => setPage('main')}
            aria-label="메인으로 이동"
            type="button"
  >
              <img src={logo} alt="Agora Logo" className="logo-img" />
            </button>
          </div>
          <nav className="nav-tabs">
            <ul>
              <li>
                <button className="tab-btn" onClick={() => setPage('popular')}>인기</button>
              </li>
              <li>
                <button className="tab-btn" onClick={() => setPage('latest')}>최신</button>
              </li>
              <li style = {{ position: 'relative'}}>
                <button 
                  className="tab-btn"
                  onClick={() => setShowThemeMenu((prev) => !prev)}
                  >주제</button>
                  {showThemeMenu && (
                    <div className="theme-dropdown">
                      <button className="theme-btn" onClick={() => { setThemePage('정치'); setPage('theme'); setShowThemeMenu(false); }}>정치</button>
                      <button className="theme-btn" onClick={() => { setThemePage('과학'); setPage('theme'); setShowThemeMenu(false); }}>과학</button>
                      <button className="theme-btn" onClick={() => { setThemePage('경제'); setPage('theme'); setShowThemeMenu(false); }}>경제</button>
                    </div>
                  )}
              </li>
              <li>
                <button 
                  className="tab-btn write-btn" 
                  onClick={() => setPage('write')}
                  type="button"
                >
                  글쓰기
                  </button>
              </li>
            </ul>
          </nav>
        </div>
        <hr className="header-divider" />
      </header>

      <main className="content">
        {page === 'main' && (
          <>
        <section className="section" id="popular">
          <button
            className="section-link"
            onClick={() => setPage('popular')}
            
          > 
            <div className="section-title">
              <span className="main-title">인기순🔥</span>
              <span className="sub-title">popularity</span>
            </div>
          </button>
          <div className="card-grid">
            {/* 카드 3개 예시 */}
            <NewsCard title="Title" likes={23} dislikes={9} />
            <NewsCard title="Title" likes={10} dislikes={7} />
            <NewsCard title="Title" likes={3} dislikes={1} />
          </div>
        </section>
        <hr className="section-divider" />

        <section className="section" id="latest">
          <button
            className="section-link"
            onClick={() => setPage('latest')}
          >
            <div className="section-title">
              <span className="main-title">최신순✨</span>
              <span className="sub-title">latest</span>
            </div>
          </button>
          <div className="card-grid">
            <NewsCard title="Title" likes={0} dislikes={0} />
            <NewsCard title="Title" likes={2} dislikes={0} />
            <NewsCard title="Title" likes={1} dislikes={1} />
          </div>
        </section>
        <hr className="section-divider" />

        <section className="section" id="theme">
            <div className="section-title">
              <span className="main-title">주제📚</span>
              <span className="sub-title">theme</span>
            </div>
          <div className="card-grid theme-grid">
            <ThemeCard category="정치" onClick={() => { setThemePage('정치'); setPage('theme'); }}/>
            <ThemeCard category="과학" onClick={() => { setThemePage('과학'); setPage('theme'); }}/>
            <ThemeCard category="경제" onClick={() => { setThemePage('경제'); setPage('theme'); }}/>
          </div>
        </section>
        </>
        )}

        {page === 'popular' && (
          <section className="popular-section">
            <h2 className="popular-title">인기 기사</h2>
            <div className="popular-list">
              {currentArticles.map((article, idx) => (
                <NewsCard
                  key={idx}
                  title={article.title}
                  likes={article.likes}
                  dislikes={article.dislikes}
                />
              ))}
            </div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPopularPage}
              setCurrentPage={setCurrentPopularPage}
            />
          </section>
        )}
        {page === 'latest' && (
          <section className="latest-section">
            <h2 className="latest-title">최신 기사</h2>
            <div className="latest-list">
            {/* 최신 기사 5개씩 NewsCard로 출력 */}
            </div>
             {/* 페이지네이션 등 필요시 추가 */}
          </section>
        )}

        {page === 'theme' && (
          <section className="theme-section">
            <h2 className="theme-title">{themePage}기사</h2>
            {/* 해당 주제 기사 리스트*/}
          </section>
        )}

        {page === 'write' && <WritePage />}
     </main>
    </div>
  );
}

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((num) => (
        <button
          key={num}
          className={num === currentPage ? 'active' : ''}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

function NewsCard({ title, brief, imageURL, likes, dislikes }) {
  return (
    <div className="news-card">
      <div className="image-wrapper">
        <img src={imageURL} alt="기사 이미지" className="news-image" />
      </div>
      <h3>{title}</h3>
      <p className="news-brief">{brief}</p>
      <div className="reaction">
        <span>
          <img src={thumbUpImg} alt="좋아요" className="thumb-icon" />
          {likes}
        </span>
        <span>
          <img src={thumbDownImg} alt="싫어요" className="thumb-icon" />
          {dislikes}
        </span>
      </div>
    </div>
  );
}

function ThemeCard({ category, onClick }) {
  const icons = {
    정치: '🎤',
    과학: '⚛️',
    경제: '💰',
  };

  return (
    <button className="theme-card" onClick={onClick} type="button">
      <div className="icon">{icons[category]}</div>
      <h3>{category}</h3>
      <p>
        {category} 관련 기사로 이동
      </p>
    </button>
  );
}

export default App;