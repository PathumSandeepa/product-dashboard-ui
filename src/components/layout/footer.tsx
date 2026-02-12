export default function Footer() {
   return (
      <footer className="border-t py-6 px-4 md:px-8">
         <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground justify-center">
            <p>&copy; {new Date().getFullYear()} Product Dashboard. All rights reserved.</p>
         </div>
      </footer>
   );
}
