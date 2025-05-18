import React, { useState, useEffect } from 'react';
import thumbUpImg from './Good_hand.png';
import thumbDownImg from './Bad_hand.png';
import './CommentSection.css'; // 아래 CSS 참고

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    const found = findCommentById(comment.replies, id);
    if (found) return found;
  }
  return null;
}

export default function CommentSection({ agreeCount: propAgreeCount, disagreeCount: propDisagreeCount, agreeSummaryList: propAgreeSummaryList, disagreeSummaryList: propDisagreeSummaryList, user, newsId, onVoteAgree, onVoteDisagree, setPage, vote, setVote }) {
  const [agreeCount, setAgreeCount] = useState(propAgreeCount ?? 0);
  const [disagreeCount, setDisagreeCount] = useState(propDisagreeCount ?? 0);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [liked, setLiked] = useState(new Set());
  const [sortBy, setSortBy] = useState('latest');
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // prop이 바뀌면 동기화
  useEffect(() => {
    setAgreeCount(propAgreeCount ?? 0);
    setDisagreeCount(propDisagreeCount ?? 0);
  }, [propAgreeCount, propDisagreeCount]);

  // vote prop이 바뀌면 내부 vote도 동기화
  useEffect(() => {
    setVote && setVote(vote ?? null);
  }, [vote, setVote]);

  const totalVotes = agreeCount + disagreeCount;
  const agreePercent = totalVotes ? Math.round((agreeCount / totalVotes) * 100) : 0;
  const disagreePercent = totalVotes ? Math.round((disagreeCount / totalVotes) * 100) : 0;

  const agreeSummaryList = propAgreeSummaryList ?? [
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다'
  ];
  const disagreeSummaryList = propDisagreeSummaryList ?? [
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다'
  ];

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newComment = {
      id: generateId(),
      text,
      likes: 0,
      replies: [],
      sentiment: Math.random() > 0.5 ? 'agree' : 'disagree'
    };
    if (replyingTo) {
      setComments(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const parent = findCommentById(copy, replyingTo);
        parent.replies.push(newComment);
        return copy;
      });
    } else {
      setComments(prev => [...prev, newComment]);
    }
    setReplyingTo(null);
    setInput('');
  };

  const handleLike = (comment) => {
    setComments(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const target = findCommentById(copy, comment.id);
      if (liked.has(comment.id)) {
        target.likes--;
      } else {
        target.likes++;
      }
      return copy;
    });
    setLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(comment.id)) newSet.delete(comment.id);
      else newSet.add(comment.id);
      return newSet;
    });
  };

  // 댓글 수정 저장
  const handleEditSave = (comment) => {
    setComments(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const target = findCommentById(copy, comment.id);
      if (target) target.text = editValue;
      return copy;
    });
    setEditingId(null);
    setEditValue('');
  };

  // 찬성/반대 버튼 핸들러
  const handleVoteAgree = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      setPage && setPage('login');
      return;
    }
    if (!newsId) return;
    let action = 1;
    if (vote === 'agree') {
      action = 0;
    } else {
      action = 1;
    }
    // fetch 제거, onVoteAgree만 호출
    await onVoteAgree && onVoteAgree(action);
  };
  const handleVoteDisagree = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      setPage && setPage('login');
      return;
    }
    if (!newsId) return;
    let action = 1;
    if (vote === 'disagree') {
      action = 0;
    } else {
      action = 1;
    }
    // fetch 제거, onVoteDisagree만 호출
    await onVoteDisagree && onVoteDisagree(action);
  };

  const renderComments = (comments, isReply = false) => {
    let sorted;
    if (sortBy === 'latest') {
      if (isReply) {
        // 대댓글은 오래된 순(오름차순)
        sorted = [...comments].sort((a, b) => a.id - b.id);
      } else {
        // 댓글은 최신순(내림차순)
        sorted = [...comments].sort((a, b) => b.id - a.id);
      }
    } else if (sortBy === 'popular') {
      sorted = [...comments].sort((a, b) => b.likes - a.likes);
    } else {
      sorted = [...comments];
    }
    return sorted.map(comment => (
      <div
        className="comment-item"
        key={comment.id}
        style={{
          border: '1.5px solid #e0e4ea',
          borderRadius: '10px',
          margin: isReply ? '10px 0 10px 32px' : '16px 0',
          padding: '14px 16px',
          background: isReply ? '#f8fafc' : '#fff',
          boxShadow: isReply ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'flex-start',
          position: 'relative'
        }}
      >
        {/* 대댓글이면 ↳ 표시 */}
        {isReply && (
          <span style={{ position: 'absolute', left: '-18px', top: 18, color: '#888', fontSize: '1.2rem', fontWeight: 700 }}>↳</span>
        )}
        <div style={{ flex: 1 }}>
          <div className="comment-meta">
            <div
              className="avatar"
              style={{
                backgroundColor: comment.sentiment === 'agree' ? '#007bff' : '#dc3545'
              }}
            />
            <span
              className="username"
              style={{
                color: comment.sentiment === 'agree' ? '#007bff' : '#dc3545'
              }}
            >
              익명
            </span>
          </div>
          <div className="comment-content">
            {editingId === comment.id ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={{ width: '80%', padding: '4px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button style={{ marginLeft: 8 }} onClick={() => handleEditSave(comment)}>저장</button>
                <button style={{ marginLeft: 4 }} onClick={() => { setEditingId(null); setEditValue(''); }}>취소</button>
              </>
            ) : (
              comment.text
            )}
          </div>
          <div className="timestamp">{new Date(comment.id).toLocaleString()}</div>
          <div className="comment-actions">
            {/* 대댓글 버튼: 토글 방식, 선택 시 강조 */}
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                style={{
                  color: replyingTo === comment.id ? '#007bff' : undefined,
                  fontWeight: replyingTo === comment.id ? 700 : undefined,
                  background: replyingTo === comment.id ? '#e6f0ff' : undefined,
                  borderRadius: '6px',
                  transition: 'all 0.15s',
                  marginRight: 4
                }}
              >
                💬
              </button>
            )}
            {/* 대댓글이 아닐 때만 추천(Like) 버튼 표시 */}
            {!isReply && (
              <button
                style={{ color: liked.has(comment.id) ? 'blue' : undefined }}
                onClick={() => handleLike(comment)}
              >
                👍 {comment.likes}
              </button>
            )}
            {/* 댓글/대댓글 모두 수정 버튼 */}
            <button onClick={() => { setEditingId(comment.id); setEditValue(comment.text); }}>수정</button>
          </div>
          {comment.replies.length > 0 && (
            <div className="reply-box">{renderComments(comment.replies, true)}</div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="comment-section-root">
      {/* 찬반 투표 영역 */}
      <div className="vote-bar">
        <button
          className={`vote-btn agree ${vote === 'agree' ? 'selected' : ''}`}
          onClick={handleVoteAgree}
        >
          <img src={thumbUpImg} alt="찬성" style={{width:'20px',verticalAlign:'middle'}} />
          <span style={{marginLeft:4}}>{agreeCount}개<br/><span style={{fontSize:'12px'}}>({agreePercent}%)</span></span>
        </button>
        <div className="vote-bar-graph">
          <div
            className="agree-bar"
            style={{ width: `${agreePercent}%` }}
          />
          <div
            className="disagree-bar"
            style={{ width: `${disagreePercent}%` }}
          />
        </div>
        <button
          className={`vote-btn disagree ${vote === 'disagree' ? 'selected' : ''}`}
          onClick={handleVoteDisagree}
        >
          <img src={thumbDownImg} alt="반대" style={{width:'20px',verticalAlign:'middle'}} />
          <span style={{marginLeft:4}}>{disagreeCount}개<br/><span style={{fontSize:'12px'}}>({disagreePercent}%)</span></span>
        </button>
      </div>
      {/* 찬성/반대 요약 영역 (3가지씩) */}
      <div className="summary-box">
        <div className="summary agree-summary">
          <div className="summary-title">찬성 요약</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {agreeSummaryList.map((item, idx) => (
              <li key={idx} style={{ color: '#007bff', fontSize: '0.98rem', marginBottom: 2 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="summary disagree-summary">
          <div className="summary-title">반대 요약</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {disagreeSummaryList.map((item, idx) => (
              <li key={idx} style={{ color: '#dc3545', fontSize: '0.98rem', marginBottom: 2 }}>{item}</li>
            ))}
          </ul>
        </div>
    </div>
    {/* 댓글 제목 + 정렬 버튼 */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0 0.5rem 0' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>댓글</h3>
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => setSortBy('latest')}
          style={{
            background: sortBy === 'latest' ? '#007bff' : '#f3f4f6',
            color: sortBy === 'latest' ? '#fff' : '#222',
            border: 'none',
            borderRadius: '6px 0 0 6px',
            padding: '6px 16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          최신순
        </button>
        <button
          onClick={() => setSortBy('popular')}
          style={{
            background: sortBy === 'popular' ? '#007bff' : '#f3f4f6',
            color: sortBy === 'popular' ? '#fff' : '#222',
            border: 'none',
            borderRadius: '0 6px 6px 0',
            padding: '6px 16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginLeft: '-1px'
          }}
        >
          인기순
        </button>
      </div>
    </div>
    {/* 댓글 시스템 */}
    <div>{renderComments(comments)}</div>
    <div className="footer">
      <input
        id="new-comment"
        placeholder={replyingTo ? '↳대댓글을 입력하세요...' : '댓글을 입력하세요...'}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button onClick={handleSend}>등록</button>
    </div>
  </div>
);
}