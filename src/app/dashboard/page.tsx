"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
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
   FieldError,
   FieldGroup,
   FieldLabel,
   FieldDescription,
} from "@/components/ui/field";

import { useProductStore } from "@/store/product-store";
import { useAuthStore } from "@/store/auth-store";
import type { Product, ProductFormData } from "@/lib/types";
import { categories, capitalize } from "@/lib/types";
import { extractFieldErrors } from "@/lib/utils";

const emptyForm: ProductFormData = {
   title: "",
   description: "",
   price: "",
   category: "electronics",
   image: "",
   rating: { rate: 0, count: 0 },
};

function validateProduct(data: ProductFormData) {
   const errs: Record<string, string> = {};

   const setError = (key: string, message: string | undefined) => {
      if (message) errs[key] = message;
   };

   const titleError = () => {
      if (!data.title.trim()) return "The product title is required.";
      if (data.title.length > 255)
         return "Title must not exceed 255 characters.";
   };

   const descriptionError = () => {
      if (!data.description.trim()) return "The description is required.";
   };

   const priceError = () => {
      if (!data.price && data.price !== "0") return "The price is required.";
      if (Number(data.price) < 0) return "Price must be 0 or more.";
   };

   const categoryError = () => {
      if (!data.category.trim()) return "The category is required.";
   };

   const imageError = () => {
      if (!data.image.trim()) return "The image URL is required.";
      if (data.image.length > 255)
         return "Image URL must not exceed 255 characters.";
   };

   const ratingRateError = () => {
      if (data.rating.rate < 0 || data.rating.rate > 5)
         return "Rating must be between 0 and 5.";
   };

   const ratingCountError = () => {
      if (data.rating.count < 0) return "Review count must be 0 or more.";
   };

   setError("title", titleError());
   setError("description", descriptionError());
   setError("price", priceError());
   setError("category", categoryError());
   setError("image", imageError());
   setError("rate", ratingRateError());
   setError("count", ratingCountError());

   return errs;
}

export default function DashboardPage() {
   const {
      products,
      meta,
      loading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
   } = useProductStore();

   const token = useAuthStore((s) => s.token);

   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("All");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");
   const [sort, setSort] = useState("");
   const [currentPage, setCurrentPage] = useState(1);

   const [viewProduct, setViewProduct] = useState<Product | null>(null);
   const [addOpen, setAddOpen] = useState(false);
   const [editProduct, setEditProduct] = useState<Product | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
   const [saving, setSaving] = useState(false);
   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
   const [generalError, setGeneralError] = useState("");
   const [form, setForm] = useState<ProductFormData>(emptyForm);

   const loadProducts = useCallback(() => {
      if (!token) return;
      fetchProducts({
         search: search || undefined,
         category: category !== "All" ? category : undefined,
         min_price: minPrice || undefined,
         max_price: maxPrice || undefined,
         sort: sort || undefined,
         page: currentPage,
      });
   }, [
      fetchProducts,
      token,
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      currentPage,
   ]);

   useEffect(() => {
      loadProducts();
   }, [loadProducts]);

   const totalPages = meta?.last_page ?? 1;
   const total = meta?.total ?? 0;

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

   const openAddDialog = () => {
      setForm(emptyForm);
      setFormErrors({});
      setGeneralError("");
      setAddOpen(true);
   };

   const handleAdd = async (e: FormEvent) => {
      e.preventDefault();
      setFormErrors({});
      setGeneralError("");

      const errs = validateProduct(form);
      if (Object.keys(errs).length > 0) {
         setFormErrors(errs);
         return;
      }

      setSaving(true);
      const result = await createProduct(form);
      setSaving(false);

      if (result.ok) {
         setAddOpen(false);
         loadProducts();
         return;
      }

      if (result.errors) setFormErrors(extractFieldErrors(result.errors));
      setGeneralError(result.message);
   };

   const openEditDialog = (product: Product) => {
      setForm({
         title: product.title,
         description: product.description,
         price: product.price,
         category: product.category,
         image: product.image,
         rating: { ...product.rating },
      });
      setFormErrors({});
      setGeneralError("");
      setEditProduct(product);
   };

   const handleEdit = async (e: FormEvent) => {
      e.preventDefault();
      if (!editProduct) return;
      setFormErrors({});
      setGeneralError("");

      setSaving(true);
      const result = await updateProduct(editProduct.id, form);
      setSaving(false);

      if (result.ok) {
         setEditProduct(null);
         loadProducts();
         return;
      }

      if (result.errors) setFormErrors(extractFieldErrors(result.errors));
      setGeneralError(result.message);
   };

   const handleDelete = async () => {
      if (!deleteTarget) return;
      setSaving(true);
      setGeneralError("");

      const result = await deleteProduct(deleteTarget.id);
      setSaving(false);

      if (result.ok) {
         setDeleteTarget(null);
         loadProducts();
         return;
      }

      setGeneralError(result.message);
   };

   const renderProductForm = () => (
      <FieldGroup>
         <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
               id="title"
               value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <FieldError>{formErrors.title}</FieldError>
         </Field>
         <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
               id="description"
               value={form.description}
               onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
               }
            />
            <FieldError>{formErrors.description}</FieldError>
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
               />
               <FieldError>{formErrors.price}</FieldError>
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
               <FieldError>{formErrors.category}</FieldError>
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
            <FieldError>{formErrors.image}</FieldError>
            <FieldDescription>
               Paste the URL of the product image.
            </FieldDescription>
         </Field>
         <div className="grid grid-cols-2 gap-4">
            <Field>
               <FieldLabel htmlFor="rate">Rating (0-5)</FieldLabel>
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
               <FieldError>{formErrors.rate}</FieldError>
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
               <FieldError>{formErrors.count}</FieldError>
            </Field>
         </div>
         <FieldError className="text-center">{generalError}</FieldError>
      </FieldGroup>
   );

   return (
      <div className="min-h-screen flex flex-col bg-background">
         <Navbar />

         <main className="flex-1 pt-14">
            <div className="px-6 md:px-12 py-6 space-y-6 max-w-7xl mx-auto">
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
                     <option value="price_asc">Price: Low to High</option>
                     <option value="price_desc">Price: High to Low</option>
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

               <FieldError className="text-center">{error}</FieldError>

               {loading && (
                  <div className="flex justify-center py-12">
                     <Spinner className="size-6" />
                  </div>
               )}

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
                           {products && products.length > 0 ? (
                              products.map((product) => (
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
                                             {product.rating?.rate ?? 0}
                                          </span>
                                       </div>
                                       <span className="text-xs text-muted-foreground">
                                          {product.rating?.count ?? 0} reviews
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

               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                  <p>{total} product(s) total.</p>

                  <div className="flex items-center gap-6">
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
                           <div>
                              <Badge variant="secondary">
                                 {capitalize(viewProduct.category)}
                              </Badge>
                           </div>
                        </div>
                        <div>
                           <span className="text-muted-foreground">Rating</span>
                           <div className="flex items-center gap-1">
                              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                              <span>{viewProduct.rating?.rate ?? 0}</span>
                           </div>
                        </div>
                        <div>
                           <span className="text-muted-foreground">
                              Reviews
                           </span>
                           <p>{viewProduct.rating?.count ?? 0}</p>
                        </div>
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>

         <Dialog
            open={addOpen}
            onOpenChange={(open) => {
               if (!open) {
                  setAddOpen(false);
                  setFormErrors({});
                  setGeneralError("");
               }
            }}
         >
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

         <Dialog
            open={!!editProduct}
            onOpenChange={(open) => {
               if (!open) {
                  setEditProduct(null);
                  setFormErrors({});
                  setGeneralError("");
               }
            }}
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

         <Dialog
            open={!!deleteTarget}
            onOpenChange={(open) => {
               if (!open) {
                  setDeleteTarget(null);
                  setGeneralError("");
               }
            }}
         >
            <DialogContent className="sm:max-w-sm">
               <DialogHeader>
                  <DialogTitle>Delete Product</DialogTitle>
                  <DialogDescription>
                     Are you sure you want to delete &ldquo;
                     {deleteTarget?.title}&rdquo;? This action cannot be undone.
                  </DialogDescription>
               </DialogHeader>
               <FieldError className="text-center">{generalError}</FieldError>
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
