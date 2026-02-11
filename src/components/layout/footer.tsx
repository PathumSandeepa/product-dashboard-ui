export default function Footer() {
   return (
      <footer className="border-t py-6 px-4 md:px-8">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 Product Dashboard. All rights reserved.</p>
            <div className="flex gap-4">
               <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
               </a>
               <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
               </a>
               <a href="#" className="hover:text-foreground transition-colors">
                  Contact
               </a>
            </div>
         </div>
      </footer>
   );
}
