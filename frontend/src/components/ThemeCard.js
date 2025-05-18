import React from 'react';

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

export default ThemeCard;