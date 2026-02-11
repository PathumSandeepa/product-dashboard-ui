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
