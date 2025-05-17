import React from 'react';
import CommentSection from './CommentSection';

function NewsDetailPage({ news }) {
    
  if (!news) return <div>뉴스 정보가 없습니다.</div>;

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
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{news.title}</h2>
          <img
            src={news.imageURL}
            alt="뉴스 이미지"
            style={{ width: '100%', margin: '2rem 0', borderRadius: '1rem' }}
          />
          <p style={{fontSize: '1.5rem' }}>{news.brief}</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: '#f3f4f6'}}>
        <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>댓글</h3>
            <CommentSection />
        </div>
      </div>
    </div>
  );
}

export default NewsDetailPage;