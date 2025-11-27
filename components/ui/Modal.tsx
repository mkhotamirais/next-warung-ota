"use client";

import clsx from "clsx";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";

export interface ModalContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModalContext must be used within a Modal component");
  }
  return context;
};

export const useCloseModal = () => {
  const { setOpen } = useModalContext();
  return () => setOpen(false);
};

// --- 2. MODAL CLOSE COMPONENT ---
type OriginalOnClick = React.MouseEventHandler<HTMLElement>;
type ModalCloseProps = { children: React.ReactElement; asChild?: boolean };

export const ModalClose = ({ children, asChild = false, ...props }: ModalCloseProps) => {
  const closeModal = useCloseModal();

  if (asChild) {
    const child = children;

    const originalOnClick = (child.props as { onClick?: OriginalOnClick }).onClick;

    const newOnClick: OriginalOnClick = (e: React.MouseEvent) => {
      closeModal();

      if (originalOnClick) {
        originalOnClick(e as React.MouseEvent<HTMLElement>);
      }
    };

    const mergedProps = { ...props, onClick: newOnClick };

    return React.cloneElement(child, mergedProps);
  }

  return (
    <button onClick={closeModal} {...props}>
      {children}
    </button>
  );
};

// --- 3. MODAL COMPONENT UTAMA ---
interface ModalProps {
  trigger: React.ReactElement | string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export default function Modal({ trigger, className, contentClassName, children }: ModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const toggleModal = useCallback(() => setOpen((prev) => !prev), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function settingMounted() {
      setMounted(true);
    }
    settingMounted();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeModal, open]);

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
      toggleModal();
      if (originalTriggerOnClick) {
        originalTriggerOnClick(e as React.MouseEvent<HTMLElement>);
      }
    },
    "aria-expanded": open,
    "aria-controls": "modal-content",
  } as React.Attributes);

  const ModalContent = (
    <dialog
      onClick={() => setOpen(false)}
      className={clsx(
        "z-50 fixed w-full h-full inset-0 flex bg-black/50 items-center justify-center transition-opacity",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        id="modal-content"
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative bg-white rounded-xl shadow-2xl p-6 max-w-lg w-11/12 transition-all transform",
          open ? "scale-100 opacity-100" : "scale-50 opacity-0",
          contentClassName
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </dialog>
  );

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      <div className={twMerge(className, "inline-block")}>{triggerWithHandler}</div>
      {mounted && createPortal(ModalContent, document.body)}
    </ModalContext.Provider>
  );
}
