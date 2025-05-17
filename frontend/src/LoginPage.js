import React, { useState } from 'react';
import './App.css';

function LoginPage({ setUser, setPage }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isValid = id.trim() !== '' && password.trim() !== '';

  const BASE_URL = 'http://localhost:8000';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const query = `id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`;
      const res = await fetch(`${BASE_URL}/user/login?${query}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser({ id, username: id });
        setPage('main');
      } else {
        setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요');
      }
    } catch (e) {
      setError('서버 오류로 로그인에 실패했습니다');
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="text-center mt-20 mb-10">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>로그인</h1>
      </div>
      <div
        className="news-card"
        style={{
          background: '#ede9fe', // 아이보리색
          borderRadius: '1.5rem',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
          maxWidth: 500,
          minHeight: 400,
          margin: '0 auto',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="mb-8">
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', textAlign: 'left' }}>ID</div>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              style={{
                width: '90%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                outline: 'none',
                marginBottom: '2rem',
              }}
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', textAlign: 'left' }}>Password</div>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              style={{
                width: '90%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                outline: 'none',
                marginBottom: '2rem',
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '90%',
              padding: '1rem 0',
              borderRadius: '0.5rem',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '2rem',
              background: isValid ? '#000' : '#9ca3af',
              color: '#fff',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
              border: 'none',
            }}
          >
            Submit
          </button>
        </form>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;