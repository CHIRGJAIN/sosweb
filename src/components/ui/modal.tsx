"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  panelClassName?: string;
  alignment?: "center" | "end";
}

export function Modal({ open, onClose, title, description, children, panelClassName, alignment = "center" }: ModalProps) {
  const containerClass =
    alignment === "end"
      ? "items-stretch justify-end"
      : "items-center justify-center";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className={`flex min-h-full ${containerClass} p-6`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom={alignment === "end" ? "translate-x-8 opacity-0" : "translate-y-4 opacity-0"}
              enterTo="translate-x-0 translate-y-0 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0 translate-y-0 opacity-100"
              leaveTo={alignment === "end" ? "translate-x-8 opacity-0" : "translate-y-4 opacity-0"}
            >
              <Dialog.Panel
                className={`w-full max-w-lg rounded-2xl bg-[color:var(--surface)] p-6 shadow-xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] ${panelClassName ?? ""}`}
              >
                <div className="space-y-4">
                  <Dialog.Title className="font-heading text-2xl font-semibold text-ink">
                    {title}
                  </Dialog.Title>
                  {description ? (
                    <Dialog.Description className="text-sm text-muted">
                      {description}
                    </Dialog.Description>
                  ) : null}
                  <div>{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
