import React from 'react';

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((num) => (
        <button
          key={num}
          className={num === currentPage ? 'active' : ''}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default Pagination;