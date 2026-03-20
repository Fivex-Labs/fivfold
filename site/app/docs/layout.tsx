import { Header } from "@/components/layout/header";
import { DocsSidebar } from "./components/docs-sidebar";
import { MobileDocsNav } from "./components/mobile-docs-nav";
import { StackProvider } from "./components/stack-context";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StackProvider>
    <div className="flex min-h-screen flex-col bg-[#030303] text-white">
      <Header />
      <main className="flex-1 pt-24">
        <div className="mx-auto flex max-w-7xl gap-12 px-6 pb-24">
          <DocsSidebar />
          <div className="min-w-0 flex-1">
            <MobileDocsNav />
            {children}
          </div>
        </div>
      </main>
    </div>
    </StackProvider>
  );
}
