import { create } from "zustand";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type {
   Product,
   ProductFormData,
   PaginatedResponse,
   PaginationMeta,
} from "@/lib/types";

interface ProductFilters {
   search?: string;
   category?: string;
   min_price?: string;
   max_price?: string;
   sort?: string;
   page?: number;
}

interface ProductStore {
   products: Product[];
   meta: PaginationMeta | null;
   loading: boolean;
   error: string;

   fetchProducts: (filters?: ProductFilters) => Promise<void>;
   createProduct: (
      data: ProductFormData,
   ) => Promise<
      | { ok: true; product: Product }
      | { ok: false; message: string; errors?: Record<string, string[]> }
   >;
   updateProduct: (
      id: number,
      data: Partial<ProductFormData>,
   ) => Promise<
      | { ok: true; product: Product }
      | { ok: false; message: string; errors?: Record<string, string[]> }
   >;
   deleteProduct: (
      id: number,
   ) => Promise<{ ok: true } | { ok: false; message: string }>;
}

function getToken() {
   return useAuthStore.getState().token ?? "";
}

function normalizeRating(
   value: Product["rating"] | string | null | undefined,
): Product["rating"] {
   if (!value) return { rate: 0, count: 0 };
   if (typeof value === "string") {
      try {
         const parsed = JSON.parse(value) as {
            rate?: number;
            count?: number;
         };
         return {
            rate: typeof parsed.rate === "number" ? parsed.rate : 0,
            count: typeof parsed.count === "number" ? parsed.count : 0,
         };
      } catch {
         return { rate: 0, count: 0 };
      }
   }
   return {
      rate: typeof value.rate === "number" ? value.rate : 0,
      count: typeof value.count === "number" ? value.count : 0,
   };
}

function normalizeProduct(item: Product): Product {
   return {
      ...item,
      rating: normalizeRating(item.rating as unknown as string),
   };
}

export const useProductStore = create<ProductStore>((set) => ({
   products: [],
   meta: null,
   loading: false,
   error: "",

   fetchProducts: async (filters = {}) => {
      set({ loading: true, error: "" });

      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.min_price) params.set("min_price", filters.min_price);
      if (filters.max_price) params.set("max_price", filters.max_price);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.page) params.set("page", String(filters.page));

      const qs = params.toString();
      const url = `/api/products${qs ? `?${qs}` : ""}`;

      try {
         const res = await apiFetch<PaginatedResponse<Product>>(url, {
            token: getToken(),
         });
         set({
            products: res.data.map(normalizeProduct),
            meta: res.meta,
            loading: false,
         });
      } catch (err) {
         if (err instanceof ApiError && err.status === 401) {
            const refreshed = await useAuthStore.getState().refreshToken();
            if (refreshed) {
               try {
                  const retry = await apiFetch<PaginatedResponse<Product>>(
                     url,
                     { token: getToken() },
                  );
                  set({
                     products: retry.data.map(normalizeProduct),
                     meta: retry.meta,
                     loading: false,
                  });
                  return;
               } catch {
                  // refresh worked but retry failed
               }
            }
            set({ products: [], meta: null, loading: false, error: "" });
            window.location.href = "/login";
            return;
         }
         const msg =
            err instanceof ApiError ? err.message : "Failed to load products.";
         set({ products: [], meta: null, loading: false, error: msg });
      }
   },

   createProduct: async (data) => {
      try {
         const product = await apiFetch<Product>("/api/products", {
            method: "POST",
            body: data,
            token: getToken(),
         });
         return { ok: true, product };
      } catch (err) {
         if (err instanceof ApiError) {
            return { ok: false, message: err.message, errors: err.errors };
         }
         return { ok: false, message: "Failed to create product." };
      }
   },

   updateProduct: async (id, data) => {
      try {
         const product = await apiFetch<Product>(`/api/products/${id}`, {
            method: "PUT",
            body: data,
            token: getToken(),
         });
         return { ok: true, product };
      } catch (err) {
         if (err instanceof ApiError) {
            return { ok: false, message: err.message, errors: err.errors };
         }
         return { ok: false, message: "Failed to update product." };
      }
   },

   deleteProduct: async (id) => {
      try {
         await apiFetch<{ message: string }>(`/api/products/${id}`, {
            method: "DELETE",
            token: getToken(),
         });
         return { ok: true };
      } catch (err) {
         const msg =
            err instanceof ApiError ? err.message : "Failed to delete product.";
         return { ok: false, message: msg };
      }
   },
}));
