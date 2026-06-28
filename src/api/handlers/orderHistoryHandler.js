/**
 * Order History Handler
 * Handles paginated order history retrieval with cursor support
 */
 
import { validateLimit, buildPaginationQuery, createPaginationResponse } from '../utils/paginationHelper';
import { CursorManager } from '../utils/cursorManager';
 
const cursorManager = new CursorManager();
 
export const handleOrderHistoryRequest = async (req, res) => {
  try {
    const { limit = 20, cursor } = req.query;
 
    // Validate limit
    const limitValidation = validateLimit(limit);
    if (!limitValidation.valid) {
      return res.status(400).json({
        error: limitValidation.error,
        code: limitValidation.code,
        status: 400
      });
    }
 
    // Validate cursor if provided
    if (cursor && !cursorManager.validate(cursor)) {
      return res.status(400).json({
        error: 'Invalid or expired cursor',
        code: 'INVALID_CURSOR',
        status: 400
      });
    }
 
    // Build pagination query
    const paginationQuery = buildPaginationQuery(cursor, limitValidation.value);
 
    // Fetch orders with stable ordering (by timestamp, then by ID)
    const orders = await fetchOrdersWithPagination(
      req.userId,
      paginationQuery.offset,
      limitValidation.value + 1 // Fetch one extra to detect hasMore
    );
 
    // Determine if there are more results
    const hasMore = orders.length > limitValidation.value;
    const paginatedOrders = orders.slice(0, limitValidation.value);
 
    // Create next cursor if there are more results
    let nextCursor = null;
    if (hasMore && paginatedOrders.length > 0) {
      const lastOrder = paginatedOrders[paginatedOrders.length - 1];
      nextCursor = cursorManager.createCursor(
        lastOrder.id,
        lastOrder.createdAt,
        paginationQuery.offset + paginatedOrders.length
      );
    }
 
    return res.status(200).json(
      createPaginationResponse(paginatedOrders, cursor, limitValidation.value, hasMore, nextCursor)
    );
 
  } catch (error) {
    console.error('Order history error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      status: 500
    });
  }
};
 
async function fetchOrdersWithPagination(userId, offset, limit) {
  // This would connect to your database
  // Example: return db.orders.find({ userId }).sort({ createdAt: -1, id: 1 }).skip(offset).limit(limit);
  return [];
}
