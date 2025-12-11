"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  MapPinIcon,
  ShieldCheckIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Fragment } from "react";
import { useUIStore } from "@/stores/ui-store";

const quickLinks = [
  { icon: Cog6ToothIcon, label: "Settings" },
  { icon: GlobeAltIcon, label: "Language" },
  { icon: ShieldCheckIcon, label: "Profile" },
  { icon: MapPinIcon, label: "Location" },
  { icon: DocumentTextIcon, label: "Terms & Conditions" },
];

export function ProfilePanel() {
  const { isProfileOpen, closeProfile } = useUIStore();

  return (
    <Transition.Root show={isProfileOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeProfile}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/50 backdrop-blur" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-[color:var(--surface)] shadow-xl shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <Dialog.Title className="font-heading text-lg font-semibold text-ink">
                      Quick Access
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={closeProfile}
                      className="rounded-full border border-slate-200 p-1 text-ink transition hover-border-primary hover-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <XMarkIcon className="size-6" aria-hidden="true" />
                      <span className="sr-only">Close profile panel</span>
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                    <div className="flex items-center gap-4">
                      <Image
                        src="https://example.com/profile_image.png"
                        alt="Rajat Bhati"
                        width={80}
                        height={80}
                        className="size-20 rounded-full border object-cover"
                        style={{ borderColor: "rgba(255, 115, 0, 0.4)" }}
                      />
                      <div>
                        <p className="font-heading text-xl font-semibold text-ink">Rajat Bhati</p>
                        <p className="text-sm text-slate-500">Active Responder</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {quickLinks.map(({ icon: Icon, label }) => (
                        <button
                          key={label}
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-ink shadow-sm transition hover-border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="size-5 text-primary" aria-hidden="true" />
                            {label}
                          </span>
                          <span aria-hidden="true" className="text-slate-400">
                            →
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl bg-ink px-4 py-5 text-white">
                      <p
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: "rgba(255, 115, 0, 0.8)" }}
                      >
                        Location Sync
                      </p>
                      <p className="mt-2 text-base font-medium">
                        Keep your live location updated so the crisis cells can mobilise within minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
