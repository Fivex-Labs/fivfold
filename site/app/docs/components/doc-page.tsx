import { DocsToc } from "./docs-toc";
import type { StackConfiguratorSidebarProps } from "./stack-configurator-sidebar";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocPageProps {
  title: string;
  description?: string;
  headings: TocItem[];
  children: React.ReactNode;
  stackConfig?: StackConfiguratorSidebarProps;
}

export function DocPage({ title, description, headings, children, stackConfig }: DocPageProps) {
  return (
    <div className="flex gap-12">
      <article className="min-w-0 flex-1">
        <header className="mb-10">
          <h1 className="text-5xl font-black tracking-tight text-white">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-white/60">{description}</p>
          )}
        </header>
        <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-12 prose-h2:border-t prose-h2:border-white/10 prose-h2:pt-8 prose-h2:text-xl prose-h2:scroll-mt-24 prose-h3:mt-8 prose-h3:text-lg prose-h3:scroll-mt-24 prose-p:text-white/80 prose-a:text-brand-secondary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-brand-secondary prose-code:before:content-none prose-code:after:content-none prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:border-l-2 prose-pre:border-l-brand-accent">
          {children}
        </div>
      </article>
      <DocsToc headings={headings} stackConfig={stackConfig} />
    </div>
  );
}
