"use client";

import { useState, useMemo, FormEvent } from "react";
import {
   Search,
   Star,
   Plus,
   MoreVertical,
   Pencil,
   Trash2,
   ChevronLeft,
   ChevronRight,
   ChevronsLeft,
   ChevronsRight,
   X,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ProductImage } from "@/components/product-image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableHead,
   TableCell,
} from "@/components/ui/table";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogFooter,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
   Field,
   FieldGroup,
   FieldLabel,
   FieldDescription,
} from "@/components/ui/field";

import { useProductStore } from "@/store/product-store";
import type { Product, ProductFormData } from "@/lib/types";
import { categories, capitalize } from "@/lib/types";

const emptyForm: ProductFormData = {
   title: "",
   description: "",
   price: "",
   category: "electronics",
   image: "",
   rating: { rate: 0, count: 0 },
};

export default function DashboardPage() {
   const { products, loading, addProduct, updateProduct, deleteProduct } =
      useProductStore();

   // Filters
   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("All");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");
   const [sort, setSort] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   // Dialogs
   const [viewProduct, setViewProduct] = useState<Product | null>(null);
   const [addOpen, setAddOpen] = useState(false);
   const [editProduct, setEditProduct] = useState<Product | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
   const [saving, setSaving] = useState(false);

   const [form, setForm] = useState<ProductFormData>(emptyForm);

   // ---- filter + sort -----------------------------------------------------

   const filteredProducts = useMemo(() => {
      let result = [...products];

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
   }, [products, search, category, minPrice, maxPrice, sort]);

   // ---- pagination --------------------------------------------------------

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

   // ---- add product -------------------------------------------------------

   const openAddDialog = () => {
      setForm(emptyForm);
      setAddOpen(true);
   };

   const handleAdd = (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      // TODO: replace with API POST /api/products
      setTimeout(() => {
         addProduct(form);
         setSaving(false);
         setAddOpen(false);
      }, 400);
   };

   // ---- edit product ------------------------------------------------------

   const openEditDialog = (product: Product) => {
      setForm({
         title: product.title,
         description: product.description,
         price: product.price,
         category: product.category,
         image: product.image,
         rating: { ...product.rating },
      });
      setEditProduct(product);
   };

   const handleEdit = (e: FormEvent) => {
      e.preventDefault();
      if (!editProduct) return;
      setSaving(true);
      // TODO: replace with API PUT /api/products/{id}
      setTimeout(() => {
         updateProduct(editProduct.id, form);
         setSaving(false);
         setEditProduct(null);
      }, 400);
   };

   // ---- delete product ----------------------------------------------------

   const handleDelete = () => {
      if (!deleteTarget) return;
      setSaving(true);
      // TODO: replace with API DELETE /api/products/{id}
      setTimeout(() => {
         deleteProduct(deleteTarget.id);
         setSaving(false);
         setDeleteTarget(null);
      }, 400);
   };

   // ---- shared form fields ------------------------------------------------

   const renderProductForm = () => (
      <FieldGroup>
         <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
               id="title"
               value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })}
               required
            />
         </Field>
         <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
               id="description"
               value={form.description}
               onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
               }
               required
            />
         </Field>
         <div className="grid grid-cols-2 gap-4">
            <Field>
               <FieldLabel htmlFor="price">Price</FieldLabel>
               <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
               />
            </Field>
            <Field>
               <FieldLabel htmlFor="category">Category</FieldLabel>
               <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                     setForm({ ...form, category: e.target.value })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background text-sm px-3"
               >
                  {categories
                     .filter((c) => c !== "All")
                     .map((c) => (
                        <option key={c} value={c}>
                           {capitalize(c)}
                        </option>
                     ))}
               </select>
            </Field>
         </div>
         <Field>
            <FieldLabel htmlFor="image">Image URL</FieldLabel>
            <Input
               id="image"
               type="url"
               value={form.image}
               onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <FieldDescription>
               Paste the URL of the product image.
            </FieldDescription>
         </Field>
         <div className="grid grid-cols-2 gap-4">
            <Field>
               <FieldLabel htmlFor="rate">Rating</FieldLabel>
               <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating.rate}
                  onChange={(e) =>
                     setForm({
                        ...form,
                        rating: {
                           ...form.rating,
                           rate: parseFloat(e.target.value) || 0,
                        },
                     })
                  }
               />
            </Field>
            <Field>
               <FieldLabel htmlFor="count">Review Count</FieldLabel>
               <Input
                  id="count"
                  type="number"
                  min="0"
                  value={form.rating.count}
                  onChange={(e) =>
                     setForm({
                        ...form,
                        rating: {
                           ...form.rating,
                           count: parseInt(e.target.value) || 0,
                        },
                     })
                  }
               />
            </Field>
         </div>
      </FieldGroup>
   );

   return (
      <div className="min-h-screen flex flex-col bg-background">
         <Navbar />

         <main className="flex-1 pt-14">
            <div className="px-6 md:px-12 py-6 space-y-6 max-w-7xl mx-auto">
               {/* Search */}
               <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                     type="text"
                     placeholder="Search products..."
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                     }}
                     className="pl-10"
                  />
               </div>

               {/* Filters + Add Product */}
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
                     <option value="price_asc">Price: Low High</option>
                     <option value="price_desc">Price: High Low</option>
                     <option value="newest">Newest First</option>
                  </select>

                  {hasActiveFilters && (
                     <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="size-4" />
                        Clear
                     </Button>
                  )}

                  <div className="ml-auto">
                     <Button onClick={openAddDialog}>
                        <Plus className="size-4" />
                        Add Product
                     </Button>
                  </div>
               </div>

               {/* Loading */}
               {loading && (
                  <div className="flex justify-center py-12">
                     <Spinner className="size-6" />
                  </div>
               )}

               {/* Data Table */}
               {!loading && (
                  <div className="rounded-xl border">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead className="min-w-48">Title</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead className="w-10" />
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {paginatedProducts.length > 0 ? (
                              paginatedProducts.map((product) => (
                                 <TableRow
                                    key={product.id}
                                    className="cursor-pointer"
                                    onClick={() => setViewProduct(product)}
                                 >
                                    <TableCell className="font-medium">
                                       {product.title}
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
                                    <TableCell>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={(e) =>
                                                   e.stopPropagation()
                                                }
                                             >
                                                <MoreVertical className="size-4" />
                                             </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                             <DropdownMenuItem
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   openEditDialog(product);
                                                }}
                                             >
                                                <Pencil className="size-4" />
                                                Edit
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   setDeleteTarget(product);
                                                }}
                                             >
                                                <Trash2 className="size-4" />
                                                Delete
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </TableCell>
                                 </TableRow>
                              ))
                           ) : (
                              <TableRow>
                                 <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                 >
                                    No products found.
                                 </TableCell>
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </div>
               )}

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

         {/* VIEW PRODUCT DIALOG                                              */}
         <Dialog
            open={!!viewProduct}
            onOpenChange={(open) => !open && setViewProduct(null)}
         >
            <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                  <DialogTitle>{viewProduct?.title}</DialogTitle>
                  <DialogDescription>Product details</DialogDescription>
               </DialogHeader>

               {viewProduct && (
                  <div className="space-y-4">
                     <ProductImage
                        src={viewProduct.image}
                        alt={viewProduct.title}
                        className="w-full h-48 object-contain bg-muted"
                     />

                     <p className="text-sm text-muted-foreground">
                        {viewProduct.description}
                     </p>

                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                           <span className="text-muted-foreground">Price</span>
                           <p className="font-semibold tabular-nums">
                              ${viewProduct.price}
                           </p>
                        </div>
                        <div>
                           <span className="text-muted-foreground">
                              Category
                           </span>
                           <p>
                              <Badge variant="secondary">
                                 {capitalize(viewProduct.category)}
                              </Badge>
                           </p>
                        </div>
                        <div>
                           <span className="text-muted-foreground">Rating</span>
                           <div className="flex items-center gap-1">
                              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                              <span>{viewProduct.rating.rate}</span>
                           </div>
                        </div>
                        <div>
                           <span className="text-muted-foreground">
                              Reviews
                           </span>
                           <p>{viewProduct.rating.count}</p>
                        </div>
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>

         {/* ADD PRODUCT DIALOG                                               */}
         <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                  <DialogDescription>
                     Fill in the details to create a new product.
                  </DialogDescription>
               </DialogHeader>
               <form onSubmit={handleAdd}>
                  {renderProductForm()}
                  <DialogFooter className="mt-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAddOpen(false)}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={saving}>
                        {saving && <Spinner />}
                        Create
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* EDIT PRODUCT DIALOG                                              */}
         <Dialog
            open={!!editProduct}
            onOpenChange={(open) => !open && setEditProduct(null)}
         >
            <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>
                     Update the product information.
                  </DialogDescription>
               </DialogHeader>
               <form onSubmit={handleEdit}>
                  {renderProductForm()}
                  <DialogFooter className="mt-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditProduct(null)}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={saving}>
                        {saving && <Spinner />}
                        Save Changes
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* DELETE CONFIRMATION DIALOG                                       */}
         <Dialog
            open={!!deleteTarget}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
         >
            <DialogContent className="sm:max-w-sm">
               <DialogHeader>
                  <DialogTitle>Delete Product</DialogTitle>
                  <DialogDescription>
                     Are you sure you want to delete &ldquo;
                     {deleteTarget?.title}&rdquo;? This action cannot be undone.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setDeleteTarget(null)}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="destructive"
                     disabled={saving}
                     onClick={handleDelete}
                  >
                     {saving && <Spinner />}
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
