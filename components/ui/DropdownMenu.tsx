"use client";

import clsx from "clsx";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface ContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = createContext<ContextType | undefined>(undefined);

export const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const useCloseDropdownMenu = () => {
  const { setOpen } = useDropdownMenuContext();
  return () => setOpen(false);
};

type OriginalOnClick = React.MouseEventHandler<HTMLElement>;
type DropdownMenuCloseProps = { children: React.ReactElement; asChild?: boolean };

export const DropdownMenuClose = ({ children, asChild = false, ...props }: DropdownMenuCloseProps) => {
  const closeDropdownMenu = useCloseDropdownMenu();

  if (asChild) {
    const child = children;

    const originalOnClick = (child.props as { onClick?: OriginalOnClick }).onClick;

    const newOnClick: OriginalOnClick = (e: React.MouseEvent) => {
      closeDropdownMenu();

      if (originalOnClick) {
        originalOnClick(e as React.MouseEvent<HTMLElement>);
      }
    };

    const mergedProps = { ...props, onClick: newOnClick };

    return React.cloneElement(child, mergedProps);
  }

  return (
    <button onClick={closeDropdownMenu} {...props}>
      {children}
    </button>
  );
};

interface DropdownMenuProps {
  trigger: React.ReactElement | string;
  className?: string;
  children: React.ReactNode;
}

export default function DropdownMenu({ trigger, className, children }: DropdownMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdownMenu = useCallback(() => setOpen((prev) => !prev), []);
  const closeDropdownMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        contentRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        closeDropdownMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeDropdownMenu, open]);

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
      toggleDropdownMenu();
      if (originalTriggerOnClick) {
        originalTriggerOnClick(e as React.MouseEvent<HTMLElement>);
      }
    },
    "aria-expanded": open,
    "aria-controls": "dropdownMenu-content",
  } as React.Attributes);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className={twMerge(className, "relative")}>
        {triggerWithHandler}
        <div
          ref={contentRef}
          tabIndex={1}
          onBlur={() => setOpen(false)}
          className={`${
            open ? "visible opacity-100" : "invisible opacity-0"
          } absolute transition-all right-0 w-72 top-full border border-gray-300 p-3 boder rounded bg-white`}
        >
          {children}
        </div>
      </div>
    </DropdownMenuContext.Provider>
  );
}
