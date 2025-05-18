import React, { useState, useEffect, useCallback } from 'react';
import thumbUpImg from './Good_hand.png';
import thumbDownImg from './Bad_hand.png';
import './CommentSection.css'; // 아래 CSS 참고

function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// 댓글 데이터 매핑 함수: 백엔드에서 받아온 raw에 createdAt(혹은 id)로 시간 매핑, type(0/1)도 구분
function mapComment(raw, idx) {
  return {
    id: raw.id || raw.comment_index || idx,
    username: raw.username || raw.author || raw.author_id || '익명',
    text: raw.text || raw.content || raw.comment || '',
    type: raw.type ?? (raw.parent_id ? 1 : 0),
    sentiment: raw.sentiment || (raw.posneg === 1 ? 'agree' : raw.posneg === -1 ? 'disagree' : 'neutral'),
    likes: raw.likes ?? raw.like ?? 0,
    replies: Array.isArray(raw.replies) ? raw.replies.map(mapComment) : [],
    comment_index: raw.comment_index ?? idx,
    Isliked: raw.Isliked ?? false,
    parent_id: raw.parent_id ?? null,
    additional_comment: raw.additional_comment ?? [],
  };
}

export default function CommentSection({ agreeCount: propAgreeCount, disagreeCount: propDisagreeCount, user, newsId, onVoteAgree, onVoteDisagree, setPage, vote, setVote }) {
  const [agreeCount, setAgreeCount] = useState(propAgreeCount ?? 0);
  const [disagreeCount, setDisagreeCount] = useState(propDisagreeCount ?? 0);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [liked, setLiked] = useState(new Set());
  const [sortBy, setSortBy] = useState('latest');
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [agreeSummaryList, setAgreeSummaryList] = useState([
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다'
  ]);
  const [disagreeSummaryList, setDisagreeSummaryList] = useState([
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다',
    '아직 요약 내용이 없습니다'
  ]);

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

  // 댓글/대댓글 목록은 항상 fetchComments로 백엔드에서 받아옴
  const fetchComments = useCallback(async () => {
    if (!newsId) return;
    try {
      const res = await fetch(`/news/${newsId}`, { credentials: 'include' });
      if (!res.ok) return;
      const detail = await res.json();
      if (Array.isArray(detail.comment)) {
        const flat = detail.comment.map(mapComment);
        const nested = nestComments(flat);
        setComments(nested);
      } else {
        setComments([]);
      }
    } catch (e) {
      console.error("댓글을 불러오는 중 오류 발생:", e);
    }
  }, [newsId]);

  useEffect(() => { 
    fetchComments(); 
  }, [fetchComments]);

  // 댓글 요약 fetch
  useEffect(() => {
    if (!newsId) return;
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/comment/summary?news_id=${newsId}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        // 문자열을 배열로 변환
        let agreeArr = [];
        let disagreeArr = [];
        if (data.summarized_positive_comment && data.summarized_positive_comment !== '댓글이 충분하지 않습니다.') {
          agreeArr = data.summarized_positive_comment.split('\n').filter(Boolean);
        }
        if (data.summarized_negative_comment && data.summarized_negative_comment !== '댓글이 충분하지 않습니다.') {
          disagreeArr = data.summarized_negative_comment.split('\n').filter(Boolean);
        }
        setAgreeSummaryList(
          agreeArr.length > 0
            ? [...agreeArr, ...Array(3 - agreeArr.length).fill('아직 요약 내용이 없습니다')].slice(0, 3)
            : ['아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다']
        );
        setDisagreeSummaryList(
          disagreeArr.length > 0
            ? [...disagreeArr, ...Array(3 - disagreeArr.length).fill('아직 요약 내용이 없습니다')].slice(0, 3)
            : ['아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다']
        );
      } catch (e) {
        setAgreeSummaryList(['아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다']);
        setDisagreeSummaryList(['아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다', '아직 요약 내용이 없습니다']);
      }
    };
    fetchSummary();
  }, [newsId, comments]);

  // 댓글/대댓글 등록 시 createdAt(Date.now())을 쿼리로 전달, 등록 후 fetchComments로 목록 갱신
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (!user) {
      alert('로그인이 필요합니다.');
      setPage && setPage('login');
      return;
    }
    if (!newsId) return;
    let url = `/comment?news_id=${Number(newsId)}`;
    const body = JSON.stringify({
      username: user,
      content: text,
      parent_id: replyingTo !== null && replyingTo !== undefined ? Number(replyingTo) : null
    });
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
      });
      const result = await res.json();
      setInput('');
      setReplyingTo(null);
      fetchComments();
    } catch (e) {
      alert('댓글 저장 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async (comment) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      setPage && setPage('login');
      return;
    }
    try {
      // 백엔드에 추천 요청
      if (comment.Isliked) {
        await fetch(`/comment/like?news_id=${newsId}&comment_i=${comment.comment_index}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      } else {
        await fetch(`/comment/like?news_id=${newsId}&comment_i=${comment.comment_index}`, {
          method: 'POST',
          credentials: 'include'
        });
      }
      // 프론트 상태에서 likes/Isliked만 불변성 있게 갱신, replies는 항상 보존
      setComments(prev => updateLike(prev, comment.id));
      // 전체 댓글 다시 불러오기
      setTimeout(() => fetchComments(), 500);
    } catch (e) {
      alert('공감 처리 중 오류가 발생했습니다.');
    }
  };

  // 좋아요 업데이트 함수 개선
  function updateLike(commentsArray, targetId) {
    return commentsArray.map(c => {
      if (c.id === targetId) {
        return {
          ...c,
          likes: c.Isliked ? c.likes - 1 : c.likes + 1,
          Isliked: !c.Isliked,
          replies: c.replies ? [...c.replies] : [],
        };
      } else if (c.replies && c.replies.length > 0) {
        return { 
          ...c, 
          replies: updateLike(c.replies, targetId) 
        };
      }
      return c;
    });
  }

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
    // onVoteAgree 호출
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
    // onVoteDisagree 호출
    await onVoteDisagree && onVoteDisagree(action);
  };

  // nestComments: parent_id로 계층 구조 변환 (개선)
  function nestComments(flatComments) {
    const map = {};
    const roots = [];
    // 모든 댓글을 맵에 저장
    for (const comment of flatComments) {
      map[comment.comment_index] = { ...comment, replies: [] };
    }
    // additional_comment를 replies로 변환
    for (const comment of flatComments) {
      if (comment.additional_comment && comment.additional_comment.length > 0) {
        comment.additional_comment.forEach((item, idx) => {
          const reply = {
            id: `${comment.id}_reply_${idx}`,
            username: item[0],
            text: item[1],
            type: 1,
            sentiment: comment.sentiment,
            likes: 0,
            replies: [],
            comment_index: `${comment.comment_index}_${idx}`,
            Isliked: false,
            parent_id: comment.comment_index
          };
          map[comment.comment_index].replies.push(reply);
        });
      }
    }
    // 계층 구조 생성
    for (const comment of flatComments) {
      if (comment.parent_id != null && map[comment.parent_id]) {
        map[comment.parent_id].replies.push(map[comment.comment_index]);
      } else {
        roots.push(map[comment.comment_index]);
      }
    }
    return roots;
  }

  // renderComments: createdAt이 항상 고정된 값으로, 댓글/대댓글 아래에 표기
  const renderComments = (comments, isReply = false) => {
    const safeComments = Array.isArray(comments) ? comments : [];
    // 최신순: 인덱스가 큰 댓글이 위로 오도록 정렬
    let sorted = [...safeComments].sort((a, b) => (b.comment_index ?? 0) - (a.comment_index ?? 0));
    if (sortBy === 'popular') {
      sorted = [...safeComments].sort((a, b) => b.likes - a.likes);
    }
    return sorted.map((comment, idx) => {
      return (
        <div
          className="comment-item"
          key={comment.id ?? comment.comment_index ?? idx}
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
                {comment.username || '익명'}
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
            <div className="comment-actions">
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
              <button
                style={{ color: comment.Isliked ? 'blue' : undefined }}
                onClick={() => handleLike(comment)}
              >
                👍 {comment.likes}
              </button>
              {comment.username === user && (
                <button onClick={() => { setEditingId(comment.id); setEditValue(comment.text); }}>수정</button>
              )}
            </div>
            {/* 대댓글 렌더링: 항상 부모 댓글 아래에, 들여쓰기(↳)로 계층적으로 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="reply-box">{renderComments(comment.replies, true)}</div>
            )}
          </div>
        </div>
      )
    });
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
            {(agreeSummaryList.some(item => item && item !== '아직 요약 내용이 없습니다')
              ? agreeSummaryList
              : Array(3).fill('아직 요약 내용이 없습니다')
            ).map((item, idx) => (
              <li key={idx} style={{ color: '#007bff', fontSize: '0.98rem', marginBottom: 2 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="summary disagree-summary">
          <div className="summary-title">반대 요약</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {(disagreeSummaryList.some(item => item && item !== '아직 요약 내용이 없습니다')
              ? disagreeSummaryList
              : Array(3).fill('아직 요약 내용이 없습니다')
            ).map((item, idx) => (
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
        {replyingTo && (
          <button style={{ marginLeft: 4 }} onClick={() => { setReplyingTo(null); setInput(''); }}>대댓글 취소</button>
        )}
      </div>
    </div>
  );
}