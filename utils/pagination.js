/**
 * Helper function to handle pagination
 * @param {Object} req - Express request object
 * @param {Object} defaultOptions - Default pagination options
 * @returns {Object} Pagination options
 */
export const getPaginationOptions = (req, defaultOptions = {}) => {
    const page = parseInt(req.query.page) || defaultOptions.page || 1;
    const limit = parseInt(req.query.limit) || defaultOptions.limit || 10;
    const skip = (page - 1) * limit;
    
    return {
      page,
      limit,
      skip
    };
  };
  
  /**
   * Create pagination metadata for response
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} totalItems - Total number of items
   * @returns {Object} Pagination metadata
   */
  export const createPaginationMeta = (page, limit, totalItems) => {
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  };