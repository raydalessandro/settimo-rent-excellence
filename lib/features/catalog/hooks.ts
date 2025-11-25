'use client';

/**
 * Feature Catalog - React Hooks
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useVehicleStorage } from '@/lib/core/storage';
import { useTrackCatalogSearch } from '@/lib/core/analytics';
import { searchVehicles, getBrands, getCategories, getFeaturedVehicles } from './api';
import { 
  DEFAULT_FILTERS, 
  SORT_OPTIONS,
  type CatalogFiltersState, 
  type SortOption 
} from './types';

/**
 * Hook per gestione filtri catalogo
 */
export function useCatalogFilters() {
  const [filters, setFilters] = useState<CatalogFiltersState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(<K extends keyof CatalogFiltersState>(
    key: K,
    value: CatalogFiltersState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback(<K extends 'marca' | 'categoria' | 'fuel'>(
    key: K,
    value: string
  ) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.marca.length > 0 ||
      filters.categoria.length > 0 ||
      filters.fuel.length > 0 ||
      filters.anticipo_zero !== undefined ||
      filters.canone_min !== undefined ||
      filters.canone_max !== undefined ||
      filters.search !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    hasActiveFilters,
  };
}

/**
 * Hook principale per ricerca catalogo
 */
export function useCatalogSearch(
  filters: CatalogFiltersState,
  sort: SortOption = 'relevance',
  page: number = 1,
  limit: number = 12
) {
  const storage = useVehicleStorage();
  const trackSearch = useTrackCatalogSearch();

  const query = useQuery({
    queryKey: ['catalog', 'search', filters, sort, page, limit],
    queryFn: async () => {
      const result = await searchVehicles(storage, filters, sort, page, limit);
      
      // Track search
      trackSearch(
        result.total,
        filters.search || undefined,
        { ...filters, sort }
      );
      
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    vehicles: query.data?.vehicles || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || 1,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
}

/**
 * Hook per infinite scroll
 */
export function useCatalogInfinite(
  filters: CatalogFiltersState,
  sort: SortOption = 'relevance',
  limit: number = 12
) {
  const storage = useVehicleStorage();

  const query = useInfiniteQuery({
    queryKey: ['catalog', 'infinite', filters, sort],
    queryFn: async ({ pageParam = 1 }) => {
      return searchVehicles(storage, filters, sort, pageParam, limit);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const vehicles = useMemo(() => {
    return query.data?.pages.flatMap(page => page.vehicles) || [];
  }, [query.data]);

  return {
    vehicles,
    total: query.data?.pages[0]?.total || 0,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}

/**
 * Hook per ottenere brand disponibili
 */
export function useBrands() {
  const storage = useVehicleStorage();

  return useQuery({
    queryKey: ['catalog', 'brands'],
    queryFn: () => getBrands(storage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook per ottenere categorie disponibili
 */
export function useCategories() {
  const storage = useVehicleStorage();

  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => getCategories(storage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook per veicoli in evidenza
 */
export function useFeaturedVehicles(limit: number = 8) {
  const storage = useVehicleStorage();

  return useQuery({
    queryKey: ['catalog', 'featured', limit],
    queryFn: () => getFeaturedVehicles(storage, limit),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook per ordinamento
 */
export function useCatalogSort() {
  const [sort, setSort] = useState<SortOption>('relevance');

  return {
    sort,
    setSort,
    sortOptions: SORT_OPTIONS,
  };
}

/**
 * Hook completo per pagina catalogo
 */
export function useCatalog() {
  const { filters, ...filtersActions } = useCatalogFilters();
  const { sort, setSort, sortOptions } = useCatalogSort();
  const [page, setPage] = useState(1);

  const searchResult = useCatalogSearch(filters, sort, page);
  const brands = useBrands();
  const categories = useCategories();

  // Reset page when filters change
  const updateFilterWithReset = useCallback(<K extends keyof CatalogFiltersState>(
    key: K,
    value: CatalogFiltersState[K]
  ) => {
    filtersActions.updateFilter(key, value);
    setPage(1);
  }, [filtersActions]);

  const toggleArrayFilterWithReset = useCallback(<K extends 'marca' | 'categoria' | 'fuel'>(
    key: K,
    value: string
  ) => {
    filtersActions.toggleArrayFilter(key, value);
    setPage(1);
  }, [filtersActions]);

  const resetFiltersWithPage = useCallback(() => {
    filtersActions.resetFilters();
    setPage(1);
  }, [filtersActions]);

  return {
    // Data
    vehicles: searchResult.vehicles,
    total: searchResult.total,
    totalPages: searchResult.totalPages,
    currentPage: page,
    isLoading: searchResult.isLoading,
    isFetching: searchResult.isFetching,
    
    // Filters
    filters,
    updateFilter: updateFilterWithReset,
    toggleArrayFilter: toggleArrayFilterWithReset,
    resetFilters: resetFiltersWithPage,
    hasActiveFilters: filtersActions.hasActiveFilters,
    
    // Sort
    sort,
    setSort,
    sortOptions,
    
    // Pagination
    page,
    setPage,
    
    // Metadata
    brands: brands.data || [],
    categories: categories.data || [],
    isLoadingMeta: brands.isLoading || categories.isLoading,
  };
}


