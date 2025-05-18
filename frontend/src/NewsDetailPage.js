import React from 'react';
import CommentSection from './CommentSection';
import ReactMarkdown from 'react-markdown';

function NewsDetailPage({ news, user, setSelectedNews, fetchArticles, setPage }) {
  const [like, setLike] = React.useState(news.like ?? 0);
  const [dislike, setDislike] = React.useState(news.dislike ?? 0);
  const [loading, setLoading] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setLike(news.like ?? 0);
    setDislike(news.dislike ?? 0);
    setImgError(false);
  }, [news]);

  if (!news) return <div>뉴스 정보가 없습니다.</div>;

  // 찬성/반대/요약 prop 준비
  const agreeCount = like;
  const disagreeCount = dislike;
  const agreeSummaryList = news.agreeSummaryList ?? ["아직 요약 내용이 없습니다", "아직 요약 내용이 없습니다", "아직 요약 내용이 없습니다"];
  const disagreeSummaryList = news.disagreeSummaryList ?? ["아직 요약 내용이 없습니다", "아직 요약 내용이 없습니다", "아직 요약 내용이 없습니다"];

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        borderRight: '1px solid #e5e7eb',
        background: '#fff',
        minWidth: 0 }}>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'left' }}>{news.title}</h2>
          <ReactMarkdown>{news.content}</ReactMarkdown>
          <CommentSection
            agreeCount={like}
            disagreeCount={dislike}
            agreeSummaryList={agreeSummaryList}
            disagreeSummaryList={disagreeSummaryList}
            user={user}
            newsId={news.id || news.news_id}
            onVoteAgree={async (action = 1) => {
              if (!user) {
                alert('로그인이 필요합니다.');
                setPage && setPage('login');
                return;
              }
              const newsId = news.id || news.news_id;
              if (!newsId) return;
              setLoading(true);
              try {
                await fetch(`/news/${newsId}/like`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user_id: user.id, action }),
                  credentials: 'include',
                });
                const res = await fetch(`/news/${newsId}`, { credentials: 'include' });
                const detail = await res.json();
                setLike(detail.like ?? detail.likes ?? like);
                setDislike(detail.dislike ?? detail.dislikes ?? dislike);
                if (detail && detail.title) setSelectedNews && setSelectedNews(detail);
                fetchArticles && fetchArticles();
              } catch (e) {
                alert('좋아요 처리 중 오류가 발생했습니다.');
              }
              setLoading(false);
            }}
            onVoteDisagree={async (action = 1) => {
              if (!user) {
                alert('로그인이 필요합니다.');
                setPage && setPage('login');
                return;
              }
              const newsId = news.id || news.news_id;
              if (!newsId) return;
              setLoading(true);
              try {
                await fetch(`/news/${newsId}/dislike`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user_id: user.id, action }),
                  credentials: 'include',
                });
                const res = await fetch(`/news/${newsId}`, { credentials: 'include' });
                const detail = await res.json();
                setLike(detail.like ?? detail.likes ?? like);
                setDislike(detail.dislike ?? detail.dislikes ?? dislike);
                if (detail && detail.title) setSelectedNews && setSelectedNews(detail);
                fetchArticles && fetchArticles();
              } catch (e) {
                alert('싫어요 처리 중 오류가 발생했습니다.');
              }
              setLoading(false);
            }}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default NewsDetailPage;