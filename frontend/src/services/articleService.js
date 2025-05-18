import { CATEGORY_MAP } from '../constants';

export const fetchArticles = async (setPopularArticles, setLatestArticles, setThemeArticles, setUser) => {
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

    setPopularArticles(Array.isArray(hotList) ? hotList : []);
    setLatestArticles(Array.isArray(recentList) ? recentList : []);

    // 주제별 분류 (인기+최신 뉴스 모두 포함, 중복 id 방지)
    const themeMap = { 'Politics': [], 'Science/Tech': [], 'Economy': [], 'Etc': [] };
    const allArticles = [...hotList, ...recentList];
    const seenIds = new Set();

    for (const item of allArticles) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      try {
        const detailRes = await fetch(`/news/${item.id}`, { credentials: 'include' });
        if (detailRes.status === 401) continue;
        const detail = await detailRes.json();
        const mappedCategory = CATEGORY_MAP[detail.category] || 'Etc';
        if (themeMap[mappedCategory]) {
          themeMap[mappedCategory].push({ ...item, category: mappedCategory });
        }
      } catch (e) {
        // pass
      }
    }
    setThemeArticles(themeMap);

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
      // setUser(null); // 로그인 상태 변경은 App.js에서 처리하거나, 인증 관련 서비스로 분리 고려
      return;
    }
    alert('뉴스 목록을 불러오는 중 오류가 발생했습니다.');
    console.error(e);
  }
};
