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
   FieldGroup,
   FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FormEvent } from "react";

export default function SignupPage() {
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = {
         name: formData.get("name"),
         email: formData.get("email"),
         password: formData.get("password"),
         password_confirmation: formData.get("password_confirmation"),
      };
      console.log("Signup data:", data);
      // TODO: Implement API call later
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
                           defaultValue="John Doe"
                           required
                        />
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           id="email"
                           name="email"
                           type="email"
                           placeholder="m@example.com"
                           defaultValue="john@example.com"
                           required
                        />
                        <FieldDescription>
                           We&apos;ll use this to contact you. We will not share
                           your email with anyone else.
                        </FieldDescription>
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                           id="password"
                           name="password"
                           type="password"
                           defaultValue="password123"
                           required
                        />
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
                           defaultValue="password123"
                           required
                        />
                        <FieldDescription>
                           Please confirm your password.
                        </FieldDescription>
                     </Field>
                     <FieldGroup>
                        <Field>
                           <Button type="submit" className="w-full">
                              Create Account
                           </Button>
                           <Button
                              variant="outline"
                              type="button"
                              className="w-full"
                              onClick={() => (window.location.href = "/login")}
                           >
                              Sign in
                           </Button>
                        </Field>
                     </FieldGroup>
                  </FieldGroup>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
