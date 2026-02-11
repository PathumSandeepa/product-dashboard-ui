import { create } from "zustand";
import type { Product, ProductFormData } from "@/lib/types";

const seedProducts: Product[] = [
   {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack",
      description:
         "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve.",
      price: "109.95",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: { rate: 3.9, count: 120 },
   },
   {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts",
      description:
         "Slim-fitting style, contrast raglan long sleeve, three-button henley placket.",
      price: "22.30",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      rating: { rate: 4.1, count: 259 },
   },
   {
      id: 3,
      title: "Mens Cotton Jacket",
      description:
         "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.",
      price: "55.99",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: { rate: 4.7, count: 500 },
   },
   {
      id: 4,
      title: "Mens Casual Slim Fit",
      description:
         "The color could be slightly different between on the screen and in practice.",
      price: "15.99",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      rating: { rate: 2.1, count: 430 },
   },
   {
      id: 5,
      title: "John Hardy Women's Gold Dragon Bracelet",
      description:
         "From our Legends Collection, the Naga was inspired by the mythical water dragon.",
      price: "695.00",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      rating: { rate: 4.6, count: 400 },
   },
   {
      id: 6,
      title: "Solid Gold Petite Micropave",
      description:
         "Satisfaction Guaranteed. Return or exchange any order within 30 days.",
      price: "168.00",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
      rating: { rate: 3.9, count: 70 },
   },
   {
      id: 7,
      title: "White Gold Plated Princess",
      description:
         "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.",
      price: "9.99",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
      rating: { rate: 3.0, count: 400 },
   },
   {
      id: 8,
      title: "Pierced Owl Rose Gold Plated Stainless Steel",
      description:
         "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel.",
      price: "10.99",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
      rating: { rate: 1.9, count: 100 },
   },
   {
      id: 9,
      title: "WD 2TB Elements Portable External Hard Drive",
      description:
         "USB 3.0 and USB 2.0 Compatibility. Fast data transfers. Improve PC Performance.",
      price: "64.00",
      category: "electronics",
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      rating: { rate: 3.3, count: 203 },
   },
   {
      id: 10,
      title: "SanDisk SSD PLUS 1TB Internal SSD",
      description:
         "Easy upgrade for faster boot up, shutdown, application load and response.",
      price: "109.00",
      category: "electronics",
      image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
      rating: { rate: 2.9, count: 470 },
   },
   {
      id: 11,
      title: "Silicon Power 256GB SSD",
      description: "3D NAND flash are applied to deliver high transfer speeds.",
      price: "109.00",
      category: "electronics",
      image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
      rating: { rate: 4.8, count: 319 },
   },
   {
      id: 12,
      title: "WD 4TB Gaming Drive Works with Playstation 4",
      description:
         "Expand your PS4 gaming experience. Portable design lets you enjoy great games wherever you go.",
      price: "114.00",
      category: "electronics",
      image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
      rating: { rate: 4.8, count: 400 },
   },
   {
      id: 13,
      title: "Acer SB220Q bi 21.5 Inches Full HD Monitor",
      description: "21.5 inches Full HD (1920 x 1080) widescreen IPS display.",
      price: "599.00",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      rating: { rate: 2.9, count: 250 },
   },
   {
      id: 14,
      title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
      description:
         "49-Inch CHG90 with a steep 1800R curve. Super ultra-wide 32:9 aspect ratio.",
      price: "999.99",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81Zt42iIapL._AC_SX679_.jpg",
      rating: { rate: 2.2, count: 140 },
   },
   {
      id: 15,
      title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
      description: "US standard size. Please choose size carefully.",
      price: "56.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
      rating: { rate: 2.6, count: 235 },
   },
   {
      id: 16,
      title: "Lock and Love Women's Removable Hooded Leather Jacket",
      description: "100% Polyurethane shell, 100% Polyester lining.",
      price: "29.95",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
      rating: { rate: 2.9, count: 340 },
   },
   {
      id: 17,
      title: "Rain Jacket Women Windbreaker Striped Climbing",
      description: "Lightweight perfect for trip or casual wear. Wind-proof.",
      price: "39.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
      rating: { rate: 3.8, count: 679 },
   },
   {
      id: 18,
      title: "MBJ Women's Solid Short Sleeve Boat Neck V",
      description: "95% RAYON 5% SPANDEX. Made in USA. Lightweight fabric.",
      price: "9.85",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
      rating: { rate: 4.7, count: 130 },
   },
   {
      id: 19,
      title: "Opna Women's Short Sleeve Moisture",
      description: "100% Polyester. Machine Wash & Pre Shrunk for a Great Fit.",
      price: "7.95",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
      rating: { rate: 4.5, count: 146 },
   },
   {
      id: 20,
      title: "DANVOUY Womens T Shirt Casual Cotton Short",
      description:
         "95% Cotton, 5% Spandex. Casual, Short Sleeve, Letter Print.",
      price: "12.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
      rating: { rate: 3.6, count: 145 },
   },
];

// Store
interface ProductStore {
   products: Product[];
   loading: boolean;

   // TODO: Replace with real API calls later
   addProduct: (data: ProductFormData) => void;
   updateProduct: (id: number, data: Partial<ProductFormData>) => void;
   deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
   products: seedProducts,
   loading: false,

   addProduct: (data) => {
      const maxId = Math.max(0, ...get().products.map((p) => p.id));
      const newProduct: Product = { ...data, id: maxId + 1 };
      set((state) => ({ products: [...state.products, newProduct] }));
   },

   updateProduct: (id, data) => {
      set((state) => ({
         products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p,
         ),
      }));
   },

   deleteProduct: (id) => {
      set((state) => ({
         products: state.products.filter((p) => p.id !== id),
      }));
   },
}));
