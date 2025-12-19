import React from 'react'
import "./componentStyles/Pagination.css"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";


function Pagination({ currPage, isNextPage, isPrevPage, onPageChange, totalPages }) {
  return (
    <div className="page-section">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currPage - 1)}
        disabled={!isPrevPage}
        className={`page-btn ${!isPrevPage ? "disabled" : ""}`}>
        <FaAngleLeft />
      </button>

      {/* Page Number Input */}
      <input
        type="text"
        value={currPage}
        readOnly
        className="page-input"
      />

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currPage + 1)}
        disabled={!isNextPage}
        className={`page-btn ${!isNextPage ? "disabled" : ""}`}>
        <FaAngleRight />
      </button>
    </div>
  );
}

export default Pagination;