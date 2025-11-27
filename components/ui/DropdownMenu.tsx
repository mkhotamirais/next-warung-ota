"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

export interface ContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = createContext<ContextType | undefined>(undefined);

export const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (context === undefined) {
    throw new Error("useDropdownMenuContext must be used within a DropdownMenu");
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
  title?: string;
}

export default function DropdownMenu({ trigger, className, children, title = "Options" }: DropdownMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [positionUp, setPositionUp] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeDropdownMenu = useCallback(() => setOpen(false), []);

  const toggleDropdownMenu = useCallback(() => setOpen((prev) => !prev), []);

  const checkDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const minSpaceNeeded = 250;

      const shouldPositionUp = viewportHeight - rect.bottom < minSpaceNeeded;

      setPositionUp(shouldPositionUp);
    }
  }, []);

  useEffect(() => {
    if (open) {
      checkDropdownPosition();

      window.addEventListener("resize", checkDropdownPosition);
    } else {
      window.removeEventListener("resize", checkDropdownPosition);
    }
    return () => {
      window.removeEventListener("resize", checkDropdownPosition);
    };
  }, [open, checkDropdownPosition]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        closeDropdownMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeDropdownMenu, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdownMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const dropdownPositionClasses = positionUp
    ? "bottom-full mb-1 origin-bottom-right"
    : "top-full mt-1 origin-top-right";

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className={twMerge(className, "relative")} ref={containerRef}>
        {triggerWithHandler}
        <div
          id="dropdownMenu-content"
          className={twMerge(
            "absolute transition-all right-0 w-[calc(100vw-2.5rem)] sm:w-64 p-1 border border-gray-300 rounded bg-white shadow-lg z-10",
            dropdownPositionClasses,
            open ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-95"
          )}
          role="dialog"
        >
          <div className="flex justify-between gap-2 px-3 py-1">
            <h3 className="flex-1 text-lg font-semibold capitalize">{title}</h3>
            <button
              type="button"
              onClick={closeDropdownMenu}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="tutup menu dropdown"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2" role="group">
            {children}
          </div>
        </div>
      </div>
    </DropdownMenuContext.Provider>
  );
}
