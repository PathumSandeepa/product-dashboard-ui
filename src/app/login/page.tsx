"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function LoginPage() {
   const router = useRouter();

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = {
         email: formData.get("email"),
         password: formData.get("password"),
      };
      console.log("Login data:", data);
      // TODO: Implement API call later
      router.push("/dashboard");
   };

   return (
      <div className="flex min-h-screen items-center justify-center p-4">
         <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
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
                              defaultValue="admin@rightmo.com"
                              required
                           />
                        </Field>
                        <Field>
                           <div className="flex items-center">
                              <FieldLabel htmlFor="password">
                                 Password
                              </FieldLabel>
                              <a
                                 href="#"
                                 className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                              >
                                 Forgot your password?
                              </a>
                           </div>
                           <Input
                              id="password"
                              name="password"
                              type="password"
                              defaultValue="password"
                              required
                           />
                        </Field>
                        <Field>
                           <Button type="submit" className="w-full">
                              Login
                           </Button>
                           <Button
                              variant="outline"
                              type="button"
                              className="w-full"
                              onClick={() => (window.location.href = "/signup")}
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
