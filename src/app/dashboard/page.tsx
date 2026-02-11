"use client";

import { useState, useMemo } from "react";
import {
   Search,
   Star,
   ChevronLeft,
   ChevronRight,
   ChevronsLeft,
   ChevronsRight,
   X,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableHead,
   TableCell,
} from "@/components/ui/table";

interface Product {
   id: number;
   title: string;
   description: string;
   price: string;
   category: string;
   image: string;
   rating: { rate: number; count: number };
}

const mockProducts: Product[] = [
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
      description:
         "3D NAND flash are applied to deliver high transfer speeds to enhance overall system performance.",
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
      description:
         "21.5 inches Full HD (1920 x 1080) widescreen IPS display. Ultra-thin zero frame design.",
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
      description:
         "Note: The Jackets is US standard size. Please choose size to go to Amazon for detailed size chart.",
      price: "56.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
      rating: { rate: 2.6, count: 235 },
   },
   {
      id: 16,
      title: "Lock and Love Women's Removable Hooded Leather Jacket",
      description:
         "100% Polyurethane (shell) 100% Polyester (lining). Removable hooded faux leather moto jacket.",
      price: "29.95",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
      rating: { rate: 2.9, count: 340 },
   },
   {
      id: 17,
      title: "Rain Jacket Women Windbreaker Striped Climbing",
      description:
         "Lightweight perfect for trip or casual wear. Wind-proof and keeps you warm in cold weather.",
      price: "39.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
      rating: { rate: 3.8, count: 679 },
   },
   {
      id: 18,
      title: "MBJ Women's Solid Short Sleeve Boat Neck V",
      description:
         "95% RAYON 5% SPANDEX. Made in USA. Lightweight fabric with great stretch for comfort.",
      price: "9.85",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
      rating: { rate: 4.7, count: 130 },
   },
   {
      id: 19,
      title: "Opna Women's Short Sleeve Moisture",
      description:
         "100% Polyester. Machine Wash & Pre Shrunk for a Great Fit. Lightweight moisture-wicking fabric.",
      price: "7.95",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
      rating: { rate: 4.5, count: 146 },
   },
   {
      id: 20,
      title: "DANVOUY Womens T Shirt Casual Cotton Short",
      description:
         "95% Cotton, 5% Spandex. Features: Casual, Short Sleeve, Letter Print, V-Neck.",
      price: "12.99",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
      rating: { rate: 3.6, count: 145 },
   },
];

const categories = [
   "All",
   "men's clothing",
   "women's clothing",
   "electronics",
   "jewelery",
];

function capitalize(s: string) {
   return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function DashboardPage() {
   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("All");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");
   const [sort, setSort] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const filteredProducts = useMemo(() => {
      let result = [...mockProducts];

      if (search) {
         const q = search.toLowerCase();
         result = result.filter(
            (p) =>
               p.title.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q),
         );
      }

      if (category !== "All") {
         result = result.filter((p) => p.category === category);
      }

      if (minPrice) {
         result = result.filter(
            (p) => parseFloat(p.price) >= parseFloat(minPrice),
         );
      }

      if (maxPrice) {
         result = result.filter(
            (p) => parseFloat(p.price) <= parseFloat(maxPrice),
         );
      }

      if (sort === "price_asc") {
         result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === "price_desc") {
         result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sort === "newest") {
         result.sort((a, b) => b.id - a.id);
      }

      return result;
   }, [search, category, minPrice, maxPrice, sort]);

   const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;
   const paginatedProducts = filteredProducts.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage,
   );

   const clearFilters = () => {
      setSearch("");
      setCategory("All");
      setMinPrice("");
      setMaxPrice("");
      setSort("");
      setCurrentPage(1);
   };

   const hasActiveFilters =
      search || category !== "All" || minPrice || maxPrice || sort;

   return (
      <div className="min-h-screen flex flex-col bg-background">
         <Navbar />

         <main className="flex-1 pt-14">
            <div className="p-4 md:p-8 space-y-6">
               {/* Search */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                     type="text"
                     placeholder="Search products by title or description..."
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="pl-10"
                  />
               </div>

               {/* Filters */}
               <div className="flex flex-wrap items-center gap-3">
                  <select
                     value={category}
                     onChange={(e) => {
                        setCategory(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="h-9 rounded-md border border-input bg-background text-sm px-3 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                     {categories.map((cat) => (
                        <option key={cat} value={cat}>
                           {cat === "All" ? "All Categories" : capitalize(cat)}
                        </option>
                     ))}
                  </select>

                  <Input
                     type="number"
                     placeholder="Min price"
                     value={minPrice}
                     onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="w-28"
                  />

                  <Input
                     type="number"
                     placeholder="Max price"
                     value={maxPrice}
                     onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="w-28"
                  />

                  <select
                     value={sort}
                     onChange={(e) => {
                        setSort(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="h-9 rounded-md border border-input bg-background text-sm px-3 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                     <option value="">Sort by</option>
                     <option value="price_asc">Price: Low → High</option>
                     <option value="price_desc">Price: High → Low</option>
                     <option value="newest">Newest First</option>
                  </select>

                  {hasActiveFilters && (
                     <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="size-4" />
                        Clear Filters
                     </Button>
                  )}
               </div>

               {/* Data Table */}
               <div className="rounded-xl border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead className="min-w-45">Title</TableHead>
                           <TableHead className="min-w-62.5">
                              Description
                           </TableHead>
                           <TableHead>Price</TableHead>
                           <TableHead>Category</TableHead>
                           <TableHead>Image</TableHead>
                           <TableHead>Rating</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {paginatedProducts.length > 0 ? (
                           paginatedProducts.map((product) => (
                              <TableRow key={product.id}>
                                 <TableCell className="font-medium">
                                    {product.title}
                                 </TableCell>
                                 <TableCell className="text-muted-foreground max-w-75 truncate">
                                    {product.description}
                                 </TableCell>
                                 <TableCell className="tabular-nums">
                                    ${product.price}
                                 </TableCell>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       {capitalize(product.category)}
                                    </Badge>
                                 </TableCell>
                                 <TableCell>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                       src={product.image}
                                       alt={product.title}
                                       className="size-10 rounded object-cover"
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-1">
                                       <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                                       <span className="text-sm">
                                          {product.rating.rate}
                                       </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                       {product.rating.count} reviews
                                    </span>
                                 </TableCell>
                              </TableRow>
                           ))
                        ) : (
                           <TableRow>
                              <TableCell
                                 colSpan={6}
                                 className="h-24 text-center"
                              >
                                 No products found.
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>

               {/* Pagination */}
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                  <p>{filteredProducts.length} product(s) total.</p>

                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                           value={rowsPerPage}
                           onChange={(e) => {
                              setRowsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                           }}
                           className="h-8 w-16 rounded-md border border-input bg-background text-sm px-2"
                        >
                           <option value={5}>5</option>
                           <option value={10}>10</option>
                           <option value={20}>20</option>
                        </select>
                     </div>

                     <span>
                        Page {currentPage} of {totalPages}
                     </span>

                     <div className="flex items-center gap-1">
                        <Button
                           variant="outline"
                           size="icon-sm"
                           disabled={currentPage <= 1}
                           onClick={() => setCurrentPage(1)}
                        >
                           <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                           variant="outline"
                           size="icon-sm"
                           disabled={currentPage <= 1}
                           onClick={() => setCurrentPage((p) => p - 1)}
                        >
                           <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                           variant="outline"
                           size="icon-sm"
                           disabled={currentPage >= totalPages}
                           onClick={() => setCurrentPage((p) => p + 1)}
                        >
                           <ChevronRight className="size-4" />
                        </Button>
                        <Button
                           variant="outline"
                           size="icon-sm"
                           disabled={currentPage >= totalPages}
                           onClick={() => setCurrentPage(totalPages)}
                        >
                           <ChevronsRight className="size-4" />
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
