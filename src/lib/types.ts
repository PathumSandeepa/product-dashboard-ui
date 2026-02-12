export interface Product {
   id: number;
   title: string;
   description: string;
   price: string;
   category: string;
   image: string;
   rating: { rate: number; count: number };
}

export type ProductFormData = Omit<Product, "id">;

export interface PaginationMeta {
   current_page: number;
   from: number | null;
   last_page: number;
   per_page: number;
   to: number | null;
   total: number;
}

export interface PaginatedResponse<T> {
   data: T[];
   links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
   };
   meta: PaginationMeta;
}

export const categories = [
   "All",
   "men's clothing",
   "women's clothing",
   "electronics",
   "jewelery",
] as const;

export function capitalize(s: string) {
   return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface User {
   id: number;
   name: string;
   email: string;
   email_verified_at: string | null;
   created_at: string;
   updated_at: string;
}

export interface AuthResponse {
   message: string;
   access_token: string;
   token_type: string;
   expires_in: number;
   user: User;
}

export interface ValidationErrorResponse {
   message: string;
   errors?: Record<string, string[]>;
}

export interface LoginFormData {
   email: string;
   password: string;
}

export interface RegisterFormData {
   name: string;
   email: string;
   password: string;
   password_confirmation: string;
}
