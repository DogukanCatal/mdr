"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";

export function PhotoPreview({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={url}
          alt="report photo"
          className="w-32 h-32 object-cover rounded cursor-pointer hover:opacity-80"
        />
      </DialogTrigger>
      <DialogContent className="max-w-full max-h-full p-0 bg-black">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={url}
            alt="report photo enlarged"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
