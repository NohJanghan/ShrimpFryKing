import React from 'react';
import thumbUpImg from '../Good_hand.png';
import thumbDownImg from '../Bad_hand.png';

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
          width: '700%', // 이 부분은 부모 컨테이너에 따라 조절 필요
          minWidth: 1380, // 고정 값보다는 반응형으로 개선 고려
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
        <div style={{ flex: 2, minWidth: 0, maxWidth: '40%', display: 'flex', alignItems: 'stretch', justifyContent: 'center', background: '#f3f4f6', padding: 0 }}>
          {imgError || !imageURL ? (
            <div style={{ width: '100%', height: '100%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          ) : (
            <img src={imageURL} alt="기사 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180, display: 'block', margin: 0, padding: 0, border: 0 }} onError={() => setImgError(true)} />
          )}
        </div>
        <div style={{ flex: 2, padding: '32px 32px 20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, textAlign: 'left' }}>{title}</h3>
          </div>
          <div style={{ flex: 3, display: 'flex', alignItems: 'flex-start', width: '100%' }}>
            <p style={{ fontSize: '1.13rem', color: '#444', margin: 0, textAlign: 'left' }}>{brief}</p>
          </div>
        </div>
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

export default NewsCard;