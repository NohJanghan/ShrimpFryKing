import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo_final.png';
import thumbUpImg from './Good_hand.png';
import thumbDownImg from './Bad_hand.png';
import WritePage from './WritePage';
import NewsDetailPage from './NewsDetailPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function App() {
  const [page, setPage] = useState('main');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [themePage, setThemePage] = useState(null); // '정치', '과학', '경제', '기타'
  const [popularArticles, setPopularArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [themeArticles, setThemeArticles] = useState({
    'Politics': [],
    'Science/Tech': [],
    'Economy': [],
    'Etc': [],
  });
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPopularPage, setCurrentPopularPage] = useState(1);
  const [currentLatestPage, setCurrentLatestPage] = useState(1);
  const [currentThemePage, setCurrentThemePage] = useState(1);
  const articlesPerPage = 5;
  const [user, setUser] = useState(null); // 로그인 유저 정보 (null이면 비로그인)

  // 주제별 기사 (항상 상태 선언 이후에 위치)
  const politicsArticles = themeArticles['Politics'];
  const scienceArticles = themeArticles['Science/Tech'];
  const economyArticles = themeArticles['Economy'];
  const etcArticles = themeArticles['Etc'];

  // 드롭다운 외부 클릭 시 닫힘 처리
  const themeMenuRef = React.useRef();
  useEffect(() => {
    if (!showThemeMenu) return;
    function handleClickOutside(e) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showThemeMenu]);

  // fetchArticles를 외부로 분리
  const fetchArticles = async () => {
    try {
      // 인기순
      const hotRes = await fetch('/news?order_by=hot&page=1&page_size=100', { credentials: 'include' });
      if (hotRes.status === 401) throw new Error('401');
      const hotResClone = hotRes.clone();
      let hotList = [];
      try {
        const hotData = await hotRes.json();
        hotList = Array.isArray(hotData) ? hotData : (Array.isArray(hotData.data) ? hotData.data : []);
      } catch (err) {
        const text = await hotResClone.text();
        console.error('인기 뉴스 응답(JSON 파싱 실패):', err, text);
        alert('인기 뉴스 응답이 JSON이 아닙니다. 서버 상태를 확인하세요.');
        return;
      }
      console.log('인기 뉴스 데이터:', hotList);

      // 최신순
      const recentRes = await fetch('/news?order_by=recent&page=1&page_size=100', { credentials: 'include' });
      if (recentRes.status === 401) throw new Error('401');
      const recentResClone = recentRes.clone();
      let recentList = [];
      try {
        const recentData = await recentRes.json();
        recentList = Array.isArray(recentData) ? recentData : (Array.isArray(recentData.data) ? recentData.data : []);
      } catch (err) {
        const text = await recentResClone.text();
        console.error('최신 뉴스 응답(JSON 파싱 실패):', err, text);
        alert('최신 뉴스 응답이 JSON이 아닙니다. 서버 상태를 확인하세요.');
        return;
      }
      console.log('최신 뉴스 데이터:', recentList);

      setPopularArticles(Array.isArray(hotList) ? hotList : []);
      setLatestArticles(Array.isArray(recentList) ? recentList : []);

      // 주제별 분류 (인기+최신 뉴스 모두 포함, 중복 id 방지)
      const themeMap = { 'Politics': [], 'Science/Tech': [], 'Economy': [], 'Etc': [] };
      const categoryMap = {
        '정치': 'Politics',
        '과학': 'Science/Tech',
        '경제': 'Economy',
        '기타': 'Etc',
        'Politics': 'Politics',
        'Science/Tech': 'Science/Tech',
        'Economy': 'Economy',
        'Etc': 'Etc',
      };
      const allArticles = [...hotList, ...recentList];
      const seenIds = new Set();
      for (const item of allArticles) {
        if (seenIds.has(item.id)) continue;
        seenIds.add(item.id);
        try {
          const detailRes = await fetch(`/news/${item.id}`, { credentials: 'include' });
          if (detailRes.status === 401) continue;
          const detail = await detailRes.json();
          const mappedCategory = categoryMap[detail.category] || 'Etc';
          // 디버깅용 로그 추가
          console.log('상세조회 category:', detail.category, '-> 매핑:', mappedCategory, 'item:', item);
          if (themeMap[mappedCategory]) {
            themeMap[mappedCategory].push({ ...item, category: mappedCategory });
          }
        } catch (e) {
          // pass
        }
      }
      setThemeArticles(themeMap);
      // 데이터가 비어있으면 경고
      if (!hotList.length && !recentList.length) {
        alert('서버에서 뉴스 데이터를 받아오지 못했습니다.');
      }
    } catch (e) {
      if (e?.message === '401') {
        setPopularArticles([]);
        setLatestArticles([]);
        setThemeArticles({
          'Politics': [],
          'Science/Tech': [],
          'Economy': [],
          'Etc': [],
        });
        return;
      }
      alert('뉴스 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchArticles();
  }, []);

  // 인기/최신/주제별 정렬 및 페이징 로직은 기존과 동일하게 유지
  const sortedPopularArticles = [...popularArticles].sort((a, b) => {
    const scoreA = (a.likes ?? 0) + (a.dislikes ?? 0);
    const scoreB = (b.likes ?? 0) + (b.dislikes ?? 0);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    // 합이 같으면 최신순(id 내림차순)
    return (b.id ?? 0) - (a.id ?? 0);
  });
  const totalPopularPages = Math.ceil(sortedPopularArticles.length / articlesPerPage);
  const currentPopularArticles = sortedPopularArticles.slice((currentPopularPage - 1) * articlesPerPage, currentPopularPage * articlesPerPage);

  const sortedLatestArticles = [...latestArticles].sort((a, b) => b.id - a.id);
  const totalLatestPages = Math.ceil(sortedLatestArticles.length / articlesPerPage);
  const currentLatestArticles = sortedLatestArticles.slice((currentLatestPage - 1) * articlesPerPage, currentLatestPage * articlesPerPage);

  const filteredThemeArticles = 
    themePage === '정치' ? politicsArticles :
    themePage === '과학' ? scienceArticles :
    themePage === '경제' ? economyArticles :
    etcArticles;
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
                    <button className="theme-btn" onClick={() => { setThemePage('기타'); setPage('theme'); setShowThemeMenu(false); }}>기타</button>
                  </div>
                )}
              </li>
              <li>
                <button className="tab-btn write-btn" onClick={() => setPage('write')} type="button">글쓰기</button>
              </li>
            </ul>
          </nav>
        </div>
        {/* 로그인 전이면 오른쪽에 Sign in/Register 버튼, 로그인 후면 username+Sign out */}
        {!user ? (
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ede9fe', color: '#222', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, border: '1px solid #a5b4fc' }}>
              {user.username}
            </div>
            <button
              className="tab-btn"
              style={{ background: '#fff', color: '#111', border: '1px solid #a5b4fc', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
              onClick={() => { setUser(null); setPage('main'); }}
            >
              Log out
            </button>
          </div>
        )}
      </header>
      <hr className="header-divider" />
      <main className="content" style={page === 'newsDetail'
        ? { paddingTop: '80px', height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', flexDirection: 'row' }
        : { paddingTop: '80px', margin: 0, overflowY: 'auto', height: 'calc(100vh - 80px)'}
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
                    onClick={async () => {
                      // 상세 정보 fetch
                      try {
                        const res = await fetch(`/news/${article.id}`, { credentials: 'include' });
                        const detail = await res.json();
                        setSelectedNews(detail);
                        setPage('newsDetail');
                      } catch (e) {
                        alert('뉴스 상세 정보를 불러오지 못했습니다.');
                      }
                    }}
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
                    onClick={async () => {
                      // 상세 정보 fetch
                      try {
                        const res = await fetch(`/news/${article.id}`, { credentials: 'include' });
                        const detail = await res.json();
                        setSelectedNews(detail);
                        setPage('newsDetail');
                      } catch (e) {
                        alert('뉴스 상세 정보를 불러오지 못했습니다.');
                      }
                    }}
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
                <ThemeCard category="Politics" label="정치" onClick={() => { setThemePage('정치'); setPage('theme'); }} />
                <ThemeCard category="Science/Tech" label="과학" onClick={() => { setThemePage('과학'); setPage('theme'); }} />
                <ThemeCard category="Economy" label="경제" onClick={() => { setThemePage('경제'); setPage('theme'); }} />
                <ThemeCard category="Etc" label="기타" onClick={() => { setThemePage('기타'); setPage('theme'); }} />
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
                  onClick={async () => {
                    // 상세 정보 fetch
                    try {
                      const res = await fetch(`/news/${article.id}`, { credentials: 'include' });
                      const detail = await res.json();
                      setSelectedNews(detail);
                      setPage('newsDetail');
                    } catch (e) {
                      alert('뉴스 상세 정보를 불러오지 못했습니다.');
                    }
                  }}
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
                  onClick={async () => {
                    // 상세 정보 fetch
                    try {
                      const res = await fetch(`/news/${article.id}`, { credentials: 'include' });
                      const detail = await res.json();
                      setSelectedNews(detail);
                      setPage('newsDetail');
                    } catch (e) {
                      alert('뉴스 상세 정보를 불러오지 못했습니다.');
                    }
                  }}
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
                  onClick={async () => {
                    // 상세 정보 fetch
                    try {
                      const res = await fetch(`/news/${article.id}`, { credentials: 'include' });
                      const detail = await res.json();
                      setSelectedNews(detail);
                      setPage('newsDetail');
                    } catch (e) {
                      alert('뉴스 상세 정보를 불러오지 못했습니다.');
                    }
                  }}
                  horizontal
                />
              ))}
            </div>
            <Pagination totalPages={totalThemePages} currentPage={currentThemePage} setCurrentPage={setCurrentThemePage} />
          </section>
        )}
        {page === 'write' && <WritePage user={user} setPage={setPage} fetchArticles={fetchArticles} />}
        {page === 'newsDetail' && <NewsDetailPage news={selectedNews} user={user} setSelectedNews={setSelectedNews} fetchArticles={fetchArticles} setPage={setPage} />}
        {page === 'login' && <LoginPage setUser={setUser} setPage={setPage} />}
        {page === 'register' && <RegisterPage setUser={setUser} setPage={setPage} />}
      </main>
    </div>
  );
}

function NewsCard({ title, brief, imageURL, likes, dislikes, onClick, horizontal }) {
  const [hover, setHover] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);
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
          {imgError || !imageURL ? (
            <div style={{ width: '100%', height: '100%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          ) : (
            <img src={imageURL} alt="기사 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180, display: 'block', margin: 0, padding: 0, border: 0 }} onError={() => setImgError(true)} />
          )}
        </div>
        {/* 제목+요약 (가운데 1/2) */}
        <div style={{ flex: 2, padding: '32px 32px 20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, textAlign: 'left' }}>{title}</h3>
          </div>
          <div style={{ flex: 3, display: 'flex', alignItems: 'flex-start', width: '100%' }}>
            <p style={{ fontSize: '1.13rem', color: '#444', margin: 0, textAlign: 'left' }}>{brief}</p>
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
    <div className="news-card" onClick={onClick} style={{ cursor: 'pointer', textAlign: 'left', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
      <div className="image-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f3f4f6' }}>
        {imgError || !imageURL ? (
          <div style={{ width: '100%', height: 160, background: '#444' }} />
        ) : (
          <img src={imageURL} alt="기사 이미지" className="news-image" onError={() => setImgError(true)} />
        )}
      </div>
      <h3 style={{ textAlign: 'left', width: '100%' }}>{title}</h3>
      <p className="news-brief" style={{ textAlign: 'left', width: '100%' }}>{brief}</p>
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

function ThemeCard({ category, label, onClick }) {
  const icons = {
    Politics: '🎤',
    'Science/Tech': '⚛️',
    Economy: '💰',
    Etc: '🎸',
  };
  return (
    <button className="theme-card" onClick={onClick} type="button">
      <div className="icon">{icons[category]}</div>
      <h3>{label}</h3>
      <p>{label} 관련 기사로 이동</p>
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