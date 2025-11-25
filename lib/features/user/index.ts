/**
 * Feature User - Public Exports
 */

// Favorites
export {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  getFavorites,
  isFavorite,
  countFavorites,
} from './favorites/api';

export {
  useFavorites,
  useFavoriteStatus,
  useFavoritesCount,
  useToggleFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from './favorites/hooks';

// Quotes
export {
  getUserQuotes,
  getQuoteById,
  deleteQuote,
  updateQuoteStatus,
} from './quotes/api';

export {
  useUserQuotes,
  useQuote,
  useDeleteQuote,
  useUpdateQuoteStatus,
  useQuotesCount,
} from './quotes/hooks';

// Profile
export {
  getProfile,
  updateProfile,
} from './profile/api';

export {
  useProfile,
  useUpdateProfile,
} from './profile/hooks';


