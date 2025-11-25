"use client";

import clsx from "clsx";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface ContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawerContext = createContext<ContextType | undefined>(undefined);

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const useCloseDrawer = () => {
  const { setOpen } = useDrawerContext();
  return () => setOpen(false);
};

type OriginalOnClick = React.MouseEventHandler<HTMLElement>;
type DrawerCloseProps = { children: React.ReactElement; asChild?: boolean };

export const DrawerClose = ({ children, asChild = false, ...props }: DrawerCloseProps) => {
  const closeDrawer = useCloseDrawer();

  if (asChild) {
    const child = children;

    const originalOnClick = (child.props as { onClick?: OriginalOnClick }).onClick;

    const newOnClick: OriginalOnClick = (e: React.MouseEvent) => {
      closeDrawer();

      if (originalOnClick) {
        originalOnClick(e as React.MouseEvent<HTMLElement>);
      }
    };

    const mergedProps = { ...props, onClick: newOnClick };

    return React.cloneElement(child, mergedProps);
  }

  return (
    <button onClick={closeDrawer} {...props}>
      {children}
    </button>
  );
};

interface DrawerProps {
  trigger: React.ReactElement | string;
  className?: string;
  position?: "left" | "right" | "bottom" | "top";
  children: React.ReactNode;
}

export default function Drawer({ trigger, className, position = "left", children }: DrawerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeDrawer, open]);

  let triggerElement: React.ReactElement;

  if (typeof trigger === "string") {
    triggerElement = (
      <button type="button" className="p-2 bg-blue-500 text-white rounded shadow">
        {trigger}
      </button>
    );
  } else {
    triggerElement = trigger;
  }

  const originalTriggerOnClick = (triggerElement.props as { onClick?: OriginalOnClick }).onClick;

  const triggerWithHandler = React.cloneElement(triggerElement, {
    onClick: (e: React.MouseEvent) => {
      toggleDrawer();
      if (originalTriggerOnClick) {
        originalTriggerOnClick(e as React.MouseEvent<HTMLElement>);
      }
    },
    "aria-expanded": open,
    "aria-controls": "drawer-content",
  } as React.Attributes);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <div className={twMerge(className)}>
        {triggerWithHandler}
        <div
          onClick={() => setOpen(false)}
          className={twMerge(
            "z-50 fixed inset-0 bg-black/50 transition-all",
            open ? "visible opacity-100" : "invisible opacity-0"
          )}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "absolute transition-all bg-white",
              position === "left" && `left-0 top-0 bottom-0 w-64 ${open ? "translate-x-0" : "-translate-x-full"}`,
              position === "right" && `right-0 top-0 bottom-0 w-64 ${open ? "translate-x-0" : "translate-x-full"}`,
              position === "bottom" && `bottom-0 left-0 right-0 h-1/3 ${open ? "translate-y-0" : "translate-y-full"}`,
              position === "top" && `top-0 left-0 right-0 h-1/3 ${open ? "translate-y-0" : "-translate-y-full"}`
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </DrawerContext.Provider>
  );
}
