"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

export type PosImageDialogProps = {
  id: string;
  image: StaticImageData;
  alt: string;
  actionLabel: string;
  closeLabel: string;
  sizes: string;
};

export default function PosImageDialog({
  id,
  image,
  alt,
  actionLabel,
  closeLabel,
  sizes,
}: PosImageDialogProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={actionLabel}
        data-pos-image-id={id}
        onClick={openDialog}
        className="block w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <Image
          src={image}
          alt={alt}
          loading="lazy"
          sizes={sizes}
          className="h-auto w-full border-b border-border"
        />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        data-pos-image-dialog={id}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={() => triggerRef.current?.focus()}
        className="m-auto max-h-[95vh] max-w-[95vw] overflow-visible rounded-2xl bg-surface p-0 text-text shadow-2xl backdrop:bg-black/75 open:flex open:items-center open:justify-center"
      >
        <div className="relative max-h-[95vh] max-w-[95vw] p-3 sm:p-5">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={closeDialog}
            className="absolute right-1 top-1 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-hero-bg px-3 text-2xl leading-none text-hero-text shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-2 sm:top-2"
          >
            <span aria-hidden="true">×</span>
          </button>
          <Image
            src={image}
            alt={alt}
            loading="lazy"
            sizes="95vw"
            className="h-auto max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
