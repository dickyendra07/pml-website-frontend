"use client";

import MediaPicker, {
  type MediaPickerVariant,
} from "@/components/admin/MediaPicker";
import type { MediaReference } from "@/lib/media";

type Props = {
  onSelect: (reference: MediaReference) => void;
  onClose: () => void;
  folder?: string;
  defaultVariant?: MediaPickerVariant;
};

export default function MediaLibraryModal({
  onSelect,
  onClose,
  folder = "content",
  defaultVariant = "original",
}: Props) {
  return (
    <MediaPicker
      value=""
      onChange={() => undefined}
      onReferenceChange={(reference) => {
        if (reference) onSelect(reference);
      }}
      folder={folder}
      defaultVariant={defaultVariant}
      dialogOnly
      dialogTitle="Insert Image"
      confirmLabel="Insert Image"
      onDismiss={onClose}
    />
  );
}
