import React, { useState } from 'react';
import './App.css';
import logo from './logo_with_name.png';
import thumbUpImg from './Good_hand.png';
import thumbDownImg from './Bad_hand.png';
import WritePage from './WritePage';
import NewsDetailPage from './NewsDetailPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function App() {
  const [page, setPage] = useState('main');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [themePage, setThemePage] = useState(null); // '정치', '과학', '경제'
  const [popularArticles, setPopularArticles] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPopularPage, setCurrentPopularPage] = useState(1);
  const [currentLatestPage, setCurrentLatestPage] = useState(1);
  const [currentThemePage, setCurrentThemePage] = useState(1);
  const articlesPerPage = 5;
  const [user, setUser] = useState(null); // 로그인 유저 정보 (null이면 비로그인)

  // 주제별 기사 (항상 상태 선언 이후에 위치)
  const politicsArticles = popularArticles.filter(a => a.category === '정치');
  const scienceArticles = popularArticles.filter(a => a.category === '과학');
  const economyArticles = popularArticles.filter(a => a.category === '경제');

  // 드롭다운 외부 클릭 시 닫힘 처리
  const themeMenuRef = React.useRef();
  React.useEffect(() => {
    if (!showThemeMenu) return;
    function handleClickOutside(e) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showThemeMenu]);

  React.useEffect(() => {
    async function fetchMockArticles() {
      const data = await new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: 'AI가 바꿀 미래',
              brief: '인공지능이 사회 전반에 미치는 영향과 미래 전망을 다룹니다.안녕하세요ㅕ하애ㅏ매ㅏ앪ㄴ해무훈ㅁ러하ㅜㅡㅈ더르ㅜ헉ㄹ마ㅜㅏㅎㄹ다허ㅜㄱ러ㅏ후가ㅜㅠㅏㅎ루허ㅜㄷㄱ라하숟ㅁ하ㅜㄹㅇㅁㄹ라ㅐㅁ나럼ㄴ아훔너ㅏㅎ루ㅏ넝루ㅏㄴㅇ무란ㅁ우러ㅏㅁ누람ㄴ우ㅏ룸ㄴ아룸나루나ㅓ루너ㅏㅁ루ㅏㅁ너루ㅏㅁ너라ㅓㅁ누라ㅓㅁ누라ㅓㅜㅏㅓㅎ사ㅓ',
              imageURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
              likes: 33,
              dislikes: 9,
              category: '과학'
            },
            {
              id: 2,
              title: '경제 성장률 3% 달성',
              brief: '올해 경제 성장률이 3%를 돌파했다는 소식입니다.',
              imageURL: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
              likes: 15,
              dislikes: 2,
              category: '경제'
            },
            {
              id: 3,
              title: '정치 개혁 논의 본격화',
              brief: '정치권에서 개혁 논의가 본격적으로 시작되었습니다.',
              imageURL: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
              likes: 8,
              dislikes: 1,
              category: '정치'
            }
          ]);
        }, 500);
      }); 
      setPopularArticles(data);
    }
    fetchMockArticles();
  }, []);

  // 정렬: 인기도 (좋아요 + 싫어요)
  const sortedPopularArticles = [...popularArticles].sort((a, b) => {
    const scoreA = a.likes + a.dislikes;
    const scoreB = b.likes + b.dislikes;
    return scoreB - scoreA;
  });

  const totalPopularPages = Math.ceil(sortedPopularArticles.length / articlesPerPage);
  const currentPopularArticles = sortedPopularArticles.slice((currentPopularPage - 1) * articlesPerPage, currentPopularPage * articlesPerPage);

  // 최신순 정렬: id 내림차순
  const sortedLatestArticles = [...popularArticles].sort((a, b) => b.id - a.id);
  const totalLatestPages = Math.ceil(sortedLatestArticles.length / articlesPerPage);
  const currentLatestArticles = sortedLatestArticles.slice((currentLatestPage - 1) * articlesPerPage, currentLatestPage * articlesPerPage);

  // 주제별 정렬: 해당 카테고리, id 내림차순
  const filteredThemeArticles = (themePage === '정치' ? politicsArticles : themePage === '과학' ? scienceArticles : economyArticles).sort((a, b) => b.id - a.id);
  const totalThemePages = filteredThemeArticles.length ? Math.ceil(filteredThemeArticles.length / articlesPerPage) : 1;
  const currentThemeArticles = filteredThemeArticles.slice((currentThemePage - 1) * articlesPerPage, currentThemePage * articlesPerPage);
 
  return (
    <div className="App">
      <header className="app-header" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, backgroundColor: '#fff', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
        <div className="header-row">
          <div className="logo">
            <button className="logo-btn" onClick={() => setPage('main')} aria-label="메인으로 이동" type="button">
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
              <li style={{ position: 'relative' }} ref={themeMenuRef}>
                <button className="tab-btn" onClick={() => setShowThemeMenu(prev => !prev)}>주제</button>
                {showThemeMenu && (
                  <div className="theme-dropdown">
                    <button className="theme-btn" onClick={() => { setThemePage('정치'); setPage('theme'); setShowThemeMenu(false); }}>정치</button>
                    <button className="theme-btn" onClick={() => { setThemePage('과학'); setPage('theme'); setShowThemeMenu(false); }}>과학</button>
                    <button className="theme-btn" onClick={() => { setThemePage('경제'); setPage('theme'); setShowThemeMenu(false); }}>경제</button>
                  </div>
                )}
              </li>
              <li>
                <button className="tab-btn write-btn" onClick={() => setPage('write')} type="button">글쓰기</button>
              </li>
            </ul>
          </nav>
        </div>
        {/* 로그인 전이면 오른쪽에 Sign in/Register 버튼 */}
        {!user && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="tab-btn"
              style={{ background: '#e5e7eb', color: '#111', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
              onClick={() => setPage('login')}
            >
              Sign in
            </button>
            <button
              className="tab-btn"
              style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
              onClick={() => setPage('register')}
            >
              Register
            </button>
          </div>
        )}
      </header>
      <hr className="header-divider" />
      <main className="content" style={page === 'newsDetail'
        ? { paddingTop: '80px', height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', flexDirection: 'row' }
        : { paddingTop: '80px', margin: 0, overflowY: 'auto', height: 'calc(100vh - 80px)' }
      }>
        {page === 'main' && (
          <>
            <section className="section" id="popular">
              <button className="section-link" onClick={() => setPage('popular')}>
                <div className="section-title">
                  <span className="main-title">인기순🔥</span>
                  <span className="sub-title">popularity</span>
                </div>
              </button>
              <div className="card-grid">
                {sortedPopularArticles.slice(0, 3).map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    brief={article.brief}
                    imageURL={article.imageURL}
                    likes={article.likes}
                    dislikes={article.dislikes}
                    onClick={() => { setSelectedNews(article); setPage('newsDetail'); }}
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
                {sortedLatestArticles.slice(0, 3).map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    brief={article.brief}
                    imageURL={article.imageURL}
                    likes={article.likes}
                    dislikes={article.dislikes}
                    onClick={() => { setSelectedNews(article); setPage('newsDetail'); }}
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
                <ThemeCard category="정치" onClick={() => { setThemePage('정치'); setPage('theme'); }} />
                <ThemeCard category="과학" onClick={() => { setThemePage('과학'); setPage('theme'); }} />
                <ThemeCard category="경제" onClick={() => { setThemePage('경제'); setPage('theme'); }} />
              </div>
            </section>
          </>
        )}
        {page === 'popular' && (
          <section className="popular-section">
            <h2 className="popular-title">인기 기사</h2>
            <div className="popular-list">
              {currentPopularArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  brief={article.brief}
                  imageURL={article.imageURL}
                  likes={article.likes}
                  dislikes={article.dislikes}
                  onClick={() => { setSelectedNews(article); setPage('newsDetail'); }}
                  horizontal
                />
              ))}
            </div>
            <Pagination totalPages={totalPopularPages} currentPage={currentPopularPage} setCurrentPage={setCurrentPopularPage} />
          </section>
        )}
        {page === 'latest' && (
          <section className="popular-section">
            <h2 className="popular-title">최신 기사</h2>
            <div className="popular-list">
              {currentLatestArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  brief={article.brief}
                  imageURL={article.imageURL}
                  likes={article.likes}
                  dislikes={article.dislikes}
                  onClick={() => { setSelectedNews(article); setPage('newsDetail'); }}
                  horizontal
                />
              ))}
            </div>
            <Pagination totalPages={totalLatestPages} currentPage={currentLatestPage} setCurrentPage={setCurrentLatestPage} />
          </section>
        )}
        {page === 'theme' && (
          <section className="theme-section">
            <h2 className="popular-title">{themePage} 기사</h2>
            <div className="popular-list">
              {currentThemeArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  brief={article.brief}
                  imageURL={article.imageURL}
                  likes={article.likes}
                  dislikes={article.dislikes}
                  onClick={() => { setSelectedNews(article); setPage('newsDetail'); }}
                  horizontal
                />
              ))}
            </div>
            <Pagination totalPages={totalThemePages} currentPage={currentThemePage} setCurrentPage={setCurrentThemePage} />
          </section>
        )}
        {page === 'write' && <WritePage user={user} setPage={setPage} />}
        {page === 'newsDetail' && <NewsDetailPage news={selectedNews} />}
        {page === 'login' && <LoginPage onSubmit={() => setPage('main')} />}
        {page === 'register' && <RegisterPage setPage={setPage} />}
      </main>
    </div>
  );
}

function NewsCard({ title, brief, imageURL, likes, dislikes, onClick, horizontal }) {
  const [hover, setHover] = React.useState(false);
  if (horizontal) {
    return (
      <div
        className="news-card"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '700%',
          minWidth: 1380,
          minHeight: 290,
          maxHeight: 290,
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: hover ? '0 8px 32px 0 rgba(0,0,0,0.18)' : '0 2px 4px rgba(98, 94, 94, 0.1)',
          marginBottom: 32,
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid rgb(112, 109, 109)',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* 이미지 (왼쪽 2/4) */}
        <div style={{ flex: 2, minWidth: 0, maxWidth: '40%', display: 'flex', alignItems: 'stretch', justifyContent: 'center', background: '#f3f4f6', padding: 0 }}>
          <img src={imageURL} alt="기사 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180, display: 'block', margin: 0, padding: 0, border: 0 }} />
        </div>
        {/* 제목+요약 (가운데 1/2) */}
        <div style={{ flex: 2, padding: '32px 32px 20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          </div>
          <div style={{ flex: 3, display: 'flex', alignItems: 'flex-start' }}>
            <p style={{ fontSize: '1.13rem', color: '#444', margin: 0 }}>{brief}</p>
          </div>
        </div>
        {/* 좋아요/싫어요 (오른쪽 1/4) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 32px 24px 0', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#2563eb', fontWeight: 600, fontSize: '1.18rem' }}>
              <img src={thumbUpImg} alt="좋아요" className="thumb-icon" style={{ width: 28, height: 28, marginRight: 6 }} />
              {likes}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', color: '#dc2626', fontWeight: 600, fontSize: '1.18rem' }}>
              <img src={thumbDownImg} alt="싫어요" className="thumb-icon" style={{ width: 28, height: 28, marginRight: 6 }} />
              {dislikes}
            </span>
          </div>
        </div>
      </div>
    );
  }
  // 기존 카드 레이아웃
  return (
    <div className="news-card" onClick={onClick} style={{ cursor: 'pointer' }}>
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
      <p>{category} 관련 기사로 이동</p>
    </button>
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

export default App;