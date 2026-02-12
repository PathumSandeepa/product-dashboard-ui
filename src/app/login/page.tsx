"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { extractFieldErrors } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
   const router = useRouter();
   const { login, loading } = useAuthStore();

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [generalError, setGeneralError] = useState("");

   const validate = (email: string, password: string) => {
      const errs: Record<string, string> = {};
      if (!email.trim()) errs.email = "The email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         errs.email = "Please provide a valid email address.";
      if (!password) errs.password = "The password is required.";
      return errs;
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});
      setGeneralError("");

      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string) ?? "";
      const password = (formData.get("password") as string) ?? "";

      const validationErrors = validate(email, password);
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return;
      }

      const result = await login({ email, password });

      if (result.ok) {
         router.push("/dashboard");
         return;
      }

      if (result.errors) setErrors(extractFieldErrors(result.errors));
      setGeneralError(result.message);
   };

   return (
      <div className="flex min-h-screen items-center justify-center p-4">
         <div className="flex flex-col gap-6 w-full max-w-md">
            <Card>
               <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                     Enter your email below to login to your account
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit}>
                     <FieldGroup>
                        <Field>
                           <FieldLabel htmlFor="email">Email</FieldLabel>
                           <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="m@example.com"
                           />
                           <FieldError>{errors.email}</FieldError>
                        </Field>
                        <Field>
                           <FieldLabel htmlFor="password">Password</FieldLabel>
                           <Input
                              id="password"
                              name="password"
                              type="password"
                           />
                           <FieldError>{errors.password}</FieldError>
                        </Field>

                        <FieldError className="text-center">
                           {generalError}
                        </FieldError>

                        <Field>
                           <Button
                              type="submit"
                              className="w-full"
                              disabled={loading}
                           >
                              {loading && <Spinner />}
                              Login
                           </Button>
                           <Button
                              variant="outline"
                              type="button"
                              className="w-full"
                              onClick={() => router.push("/signup")}
                           >
                              Sign up
                           </Button>
                        </Field>
                     </FieldGroup>
                  </form>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
