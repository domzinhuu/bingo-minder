import { PropsWithChildren } from "react";

export function PageAside({ children }: PropsWithChildren) {
  return (
    <aside className="w-64 bg-slate-100 border-r border-slate-200 rounded-l-lg p-4">
      {children}
    </aside>
  );
}

export function PageContent({ children }: PropsWithChildren) {
  return <div className="bg-slate-900 flex-1 rounded-r-lg p-4">{children}</div>;
}

export function PageRoot({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen max-w-[1280px] w-full mx-auto flex justify-center items-center">
      <div className=" flex z-10 shadow-lg">{children}</div>
    </div>
  );
}
