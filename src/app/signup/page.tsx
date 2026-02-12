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
   FieldDescription,
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

export default function SignupPage() {
   const router = useRouter();
   const { register, loading } = useAuthStore();

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [generalError, setGeneralError] = useState("");

   const validate = (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string,
   ) => {
      const errs: Record<string, string> = {};
      if (!name.trim()) errs.name = "The name is required.";
      else if (name.length > 255)
         errs.name = "The name must not exceed 255 characters.";
      if (!email.trim()) errs.email = "The email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         errs.email = "Please provide a valid email address.";
      else if (email.length > 255)
         errs.email = "The email must not exceed 255 characters.";
      if (!password) errs.password = "The password is required.";
      else if (password.length < 8)
         errs.password = "The password must be at least 8 characters.";
      if (password && password !== passwordConfirmation)
         errs.password_confirmation =
            "The password confirmation does not match.";
      return errs;
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});
      setGeneralError("");

      const formData = new FormData(e.currentTarget);
      const name = (formData.get("name") as string) ?? "";
      const email = (formData.get("email") as string) ?? "";
      const password = (formData.get("password") as string) ?? "";
      const passwordConfirmation =
         (formData.get("password_confirmation") as string) ?? "";

      const validationErrors = validate(
         name,
         email,
         password,
         passwordConfirmation,
      );
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return;
      }

      const result = await register({
         name,
         email,
         password,
         password_confirmation: passwordConfirmation,
      });

      if (result.ok) {
         router.push("/dashboard");
         return;
      }

      if (result.errors) setErrors(extractFieldErrors(result.errors));
      setGeneralError(result.message);
   };

   return (
      <div className="flex min-h-screen items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>Create an account</CardTitle>
               <CardDescription>
                  Enter your information below to create your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit}>
                  <FieldGroup>
                     <Field>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <Input
                           id="name"
                           name="name"
                           type="text"
                           placeholder="John Doe"
                        />
                        <FieldError>{errors.name}</FieldError>
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           id="email"
                           name="email"
                           type="email"
                           placeholder="m@example.com"
                        />
                        <FieldError>{errors.email}</FieldError>
                        <FieldDescription>
                           We&apos;ll use this to contact you. We will not share
                           your email with anyone else.
                        </FieldDescription>
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input id="password" name="password" type="password" />
                        <FieldError>{errors.password}</FieldError>
                        <FieldDescription>
                           Must be at least 8 characters long.
                        </FieldDescription>
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="password_confirmation">
                           Confirm Password
                        </FieldLabel>
                        <Input
                           id="password_confirmation"
                           name="password_confirmation"
                           type="password"
                        />
                        <FieldError>{errors.password_confirmation}</FieldError>
                        <FieldDescription>
                           Please confirm your password.
                        </FieldDescription>
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
                           Create Account
                        </Button>
                        <Button
                           variant="outline"
                           type="button"
                           className="w-full"
                           onClick={() => router.push("/login")}
                        >
                           Sign in
                        </Button>
                     </Field>
                  </FieldGroup>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
