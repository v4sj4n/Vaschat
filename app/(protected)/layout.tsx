import { Navbar } from "@/components/custom-ui/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <Navbar />
      <main className="flex-1 w-full overflow-auto">{children}</main>
    </div>
  );
}