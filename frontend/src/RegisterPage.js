import React, { useState } from 'react';
import './App.css';

// 더미 아이디 데이터
// const DUMMY_IDS = ['testuser', 'admin', 'guest'];
const INVALID_PATTERN = /[|,\s]/;

function RegisterPage({ setUser, setPage }) {
  const [id, setId] = useState('');
  const [idChecked, setIdChecked] = useState(false);
  const [idAvailable, setIdAvailable] = useState(null); // null | true | false
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const BASE_URL = 'http://localhost:8000';

  // 입력값에 금지문자 포함 여부
  const idInvalid = INVALID_PATTERN.test(id);
  const usernameInvalid = INVALID_PATTERN.test(username);
  const passwordInvalid = INVALID_PATTERN.test(password);

  // id, username, password 모두 입력 & id 중복확인 통과 & 금지문자 없을 때만 submit 가능
  const isValid = idChecked && idAvailable && username.trim() !== '' && password.trim() !== '' && !idInvalid && !usernameInvalid && !passwordInvalid;

  const handleIdCheck = async () => {
    if (!id.trim() || idInvalid) return;
    try {
      const query = `id=${encodeURIComponent(id)}`;
      const res = await fetch(`${BASE_URL}/user/check_id?${query}`);
      if (res.ok) {
        const data = await res.json();
        setIdAvailable(data.available);
        setIdChecked(true);
      } else {
        setIdAvailable(false);
        setIdChecked(true);
      }
    } catch (e) {
      setIdAvailable(false);
      setIdChecked(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg('');
    try {
      const query = `id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}&user_name=${encodeURIComponent(username)}`;
      const res = await fetch(`${BASE_URL}/user/register?${query}`, {
        method: 'POST'
      });
      if (res.ok) {
        setUser({ id, username });
        setAlertMsg('회원가입이 완료되었습니다!');
        setTimeout(() => {
          setAlertMsg('');
          setPage && setPage('main');
        }, 1000);
      } else {
        setAlertMsg('회원가입 실패: 이미 존재하는 아이디이거나 서버 오류');
      }
    } catch (e) {
      setAlertMsg('서버 오류로 회원가입에 실패했습니다');
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="text-center mt-20 mb-10">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>회원가입</h1>
      </div>
      <div
        className="news-card"
        style={{
          background: '#ede9fe',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
          maxWidth: 500,
          minHeight: 500,
          margin: '0 auto',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="mb-8" style={{ position: 'relative' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>ID</span>
              <button
                type="button"
                onClick={handleIdCheck}
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  background: '#f3f4f6',
                  color: '#2563eb',
                  border: '1px solid #c7d2fe',
                  borderRadius: '6px',
                  padding: '4px 14px',
                  cursor: 'pointer',
                  marginLeft: 8
                }}
              >
                중복확인
              </button>
            </div>
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
                marginBottom: '0.5rem',
              }}
              value={id}
              onChange={e => {
                setId(e.target.value);
                setIdChecked(false);
                setIdAvailable(null);
              }}
            />
            {/* 금지문자 안내 */}
            {idInvalid && (
              <div style={{ color: '#2563eb', fontSize: '0.98rem', marginTop: 2, marginLeft: 2 }}>사용할 수 없는 문자열이 포함되었습니다</div>
            )}
            {/* 중복확인 결과 안내문구 */}
            {!idInvalid && idChecked && idAvailable && (
              <div style={{ color: '#2563eb', fontSize: '0.98rem', marginTop: 2, marginLeft: 2 }}>사용 가능한 아이디입니다.</div>
            )}
            {!idInvalid && idChecked && idAvailable === false && (
              <div style={{ color: '#2563eb', fontSize: '0.98rem', marginTop: 2, marginLeft: 2 }}>다른 아이디를 사용해주세요</div>
            )}
          </div>
          <div className="mb-8">
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', textAlign: 'left' }}>Username</div>
            <input
              type="text"
              placeholder="사용자 이름을 입력하세요"
              style={{
                width: '90%',
                padding: '0.75rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.2rem',
                outline: 'none',
                marginBottom: '0.5rem',
              }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={!idChecked || !idAvailable}
            />
            {usernameInvalid && (
              <div style={{ color: '#2563eb', fontSize: '0.98rem', marginTop: 2, marginLeft: 2 }}>사용할 수 없는 문자열이 포함되었습니다</div>
            )}
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
                marginBottom: '0.5rem',
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={!idChecked || !idAvailable}
            />
            {passwordInvalid && (
              <div style={{ color: '#2563eb', fontSize: '0.98rem', marginTop: 2, marginLeft: 2 }}>사용할 수 없는 문자열이 포함되었습니다</div>
            )}
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
        {/* 회원가입 완료 알림 */}
        {alertMsg && (
          <div
            style={{
              width: '90%',
              background: '#fef9c3',
              borderLeft: '4px solid #2563eb',
              color: '#2563eb',
              padding: '1.25rem',
              fontSize: '1.2rem',
              borderRadius: '0.5rem',
              lineHeight: 1.6,
              marginTop: '0.5rem',
              textAlign: 'left',
            }}
          >
            {alertMsg}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;