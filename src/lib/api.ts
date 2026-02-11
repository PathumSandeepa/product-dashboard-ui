const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions {
   method?: string;
   body?: unknown;
   token?: string;
}

export async function apiFetch<T>(
   endpoint: string,
   { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
   const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
   };

   if (token) {
      headers.Authorization = `Bearer ${token}`;
   }

   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
   });

   const data = await res.json();

   if (!res.ok) {
      const error = new ApiError(
         data.message || "Something went wrong",
         res.status,
         data.errors,
      );
      throw error;
   }

   return data as T;
}

export class ApiError extends Error {
   status: number;
   errors?: Record<string, string[]>;

   constructor(
      message: string,
      status: number,
      errors?: Record<string, string[]>,
   ) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.errors = errors;
   }
}
