import { PropsWithChildren, useState } from "react";
import { Button } from "./ui/button";
import { MenuIcon, X } from "lucide-react";

export function PageAside({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="w-64 hidden lg:block bg-slate-100 border-r border-slate-200 rounded-l-lg p-4">
        {children}
      </aside>
      <aside className="w-full fixed lg:hidden flex bg-slate-100 border-r border-slate-200 shadow-lg h-20 p-4 items-center gap-2">
        <Button
          variant="outline"
          size={"icon"}
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon />
        </Button>
        <h1 className="font-title">Bingo Minder</h1>

        {open && (
          <div className="absolute left-0 top-0 z-30 w-64 h-screen shadow-lg bg-white p-4 text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((o) => !o)}
            >
              <X />
            </Button>
            {children}
          </div>
        )}
      </aside>
    </>
  );
}

export function PageContent({ children }: PropsWithChildren) {
  return (
    <div className="bg-slate-900 flex-1 rounded-r-lg p-4 mt-28 lg:mt-0">
      {children}
    </div>
  );
}

export function PageRoot({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen lg:max-w-[1280px] w-full lg:mx-auto lg:flex lg:justify-center lg:items-center">
      <div className=" flex flex-col gap-4 lg:gap-0 lg:flex-row z-10 shadow-lg">
        {children}
      </div>
    </div>
  );
}
