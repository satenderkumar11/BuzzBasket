/* eslint-disable react/prop-types */


const Pagination = ({ currentPage, totalPages , onPageChange }) => {

  const handleClick = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center my-8">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handleClick(index + 1)}
          className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages }
        className="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        Next 
      </button>
    </div>
  );
};

export default Pagination;
