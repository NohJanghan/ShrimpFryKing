import React, { useState } from 'react';

function WritePage() {
  const [author, setAuthor] = useState('');
  const [site, setSite] = useState('');
  const [topic, setTopic] = useState('');
  const isValid = author.trim() !== '' && site.trim() !== '' && topic !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('뉴스가 등록되었습니다!');
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="text-center mt-20 mb-10">
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>뉴스 올리기</h1>
      </div>
      <div
        className="news-card"
        style={{
          background: '#ede9fe', // 보라색
          borderRadius: '1.5rem',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
          maxWidth: 800,
          minHeight: 900,
          margin: '0 auto',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* 작성자 이름 */}
          <div className="mb-8">
            <div 
            style={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                color: '#374151', 
                marginBottom: '1rem', 
                textAlign: 'left' 
            }}
            >
                작성자 이름
            </div>
            <input
              type="text"
              placeholder="이름을 적어주세요"
              style={{
                width: '90%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                outline: 'none',
                marginBottom: '2rem',
              }}
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          {/* 뉴스 사이트 */}
          <div className="mb-8">
            <div 
                style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    color: '#374151', 
                    marginBottom: '1rem', 
                    textAlign: 'left' 
                }}
            >
                뉴스 사이트
            </div>
            <input
              type="text"
              placeholder="ex) www.naver.com ###"
              style={{
                width: '90%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                outline: 'none',
                marginBottom: '2rem',
              }}      
              value={site}
              onChange={e => setSite(e.target.value)}
            />
          </div>
          {/* 주제 선택 */}
          <div className="mb-10">
            <div 
                style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    color: '#374151', 
                    marginBottom: '1rem', 
                    textAlign: 'left' 
                    }}
                    >
                        주제 선택
                    </div>
            <select
              style={{
                width: '93%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                color: '#374151',
                outline: 'none',
                marginBottom: '2rem',
              }}         
              value={topic}
              onChange={e => setTopic(e.target.value)}
            >
              <option value="" disabled>주제를 선택해주세요</option>
              <option value="정치">정치</option>
              <option value="경제">경제</option>
              <option value="과학">과학</option>
            </select>
          </div>
          {/* 등록 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            style={{
                width: '90%',
                padding: '1rem 0',
                borderRadius: '0.5rem',
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '3rem',
                background: isValid ? '#000' : '#9ca3af',
                color: '#fff',
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                border: 'none',
              }}
          >
            등록
          </button>
        </form>
        {/* 경고문구 */}
        <div
            style={{
                width: '90%',
                background: '#fef9c3',
                borderLeft: '4px solid #f59e42',
                color: '#b45309',
                padding: '1.25rem',
                fontSize: '1.2rem',
                borderRadius: '0.5rem',
                lineHeight: 1.6,
                marginTop: '0.5rem',
                textAlign: 'left',
  }}
>          <div>⚠️ 같은 기사는 올리지 못합니다.</div>
          <div>⚠️ 믿을만한 뉴스 사이트가 아니면 올리지 못합니다.</div>
          <div>⚠️ 기사를 올린 뒤 삭제가 힘들 수 있습니다.</div>
        </div>
      </div>
    </div>
  );
}

export default WritePage;