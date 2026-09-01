"use client";

import { useState } from "react";
import MediaImage from "@/components/MediaImage";
import MediaPicker from "@/components/admin/MediaPicker";
import { resolveMediaUrl } from "@/lib/media";

export type FacilityGalleryItem = {
  id: string;
  image: string;
  titleEn?: string;
  titleId?: string;
  captionEn?: string;
  captionId?: string;
  sortOrder: number;
};

type FacilityGalleryManagerProps = {
  value: FacilityGalleryItem[];
  onChange: (value: FacilityGalleryItem[]) => void;
};

function createGalleryId() {
  return `gallery-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export default function FacilityGalleryManager({
  value,
  onChange,
}: FacilityGalleryManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateItem = (
    index: number,
    key: keyof FacilityGalleryItem,
    itemValue: string | number,
  ) => {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: itemValue,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    const newItem: FacilityGalleryItem = {
      id: createGalleryId(),
      image: "",
      titleEn: "",
      titleId: "",
      captionEn: "",
      captionId: "",
      sortOrder: value.length + 1,
    };

    onChange([...value, newItem]);
    setEditingIndex(value.length);
  };

  const removeItem = (index: number) => {
    onChange(
      value
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          sortOrder: itemIndex + 1,
        })),
    );

    setEditingIndex(null);
  };

  const editingItem =
    editingIndex !== null ? value[editingIndex] : null;

  return (
    <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
            Gallery
          </p>

          <h3 className="mt-2 text-2xl font-black text-black">
            Facility Gallery
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/45">
            Manage multiple images displayed on this facility page.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Add Gallery Image
        </button>
      </div>

      {value.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#f6faf7] p-6 text-sm font-bold text-black/40">
          No gallery images yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {value.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEditingIndex(index)}
              className="group overflow-hidden rounded-[24px] border border-black/5 bg-[#fcfdfc] text-left transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f7f4]">
                {item.image ? (
                  <MediaImage
                    src={resolveMediaUrl(item.image)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-black/30">
                    No Image
                  </div>
                )}

                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#039147] shadow">
                  #{index + 1}
                </span>
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-black text-black">
                  {item.titleEn || `Gallery Image ${index + 1}`}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Click to edit
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {editingItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Edit Gallery
                </p>

                <h4 className="mt-2 text-2xl font-black">
                  Gallery Image {(editingIndex ?? 0) + 1}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="rounded-full border px-4 py-2 text-sm font-bold"
              >
                Close
              </button>
            </div>

            <div className="mt-6">
              <MediaPicker
                value={editingItem.image}
                onChange={(url) =>
                  updateItem(editingIndex!, "image", url)
                }
                folder="facilities"
                title="Gallery Image"
                description="Choose or upload an image for this facility gallery."
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={editingItem.titleEn || ""}
                onChange={(event) =>
                  updateItem(
                    editingIndex!,
                    "titleEn",
                    event.target.value,
                  )
                }
                placeholder="Title English"
                className="rounded-2xl border px-4 py-3 text-sm font-semibold outline-none focus:border-[#039147]"
              />

              <input
                value={editingItem.titleId || ""}
                onChange={(event) =>
                  updateItem(
                    editingIndex!,
                    "titleId",
                    event.target.value,
                  )
                }
                placeholder="Title Indonesia"
                className="rounded-2xl border px-4 py-3 text-sm font-semibold outline-none focus:border-[#039147]"
              />

              <textarea
                value={editingItem.captionEn || ""}
                onChange={(event) =>
                  updateItem(
                    editingIndex!,
                    "captionEn",
                    event.target.value,
                  )
                }
                placeholder="Caption English"
                rows={4}
                className="rounded-2xl border px-4 py-3 text-sm font-semibold outline-none focus:border-[#039147]"
              />

              <textarea
                value={editingItem.captionId || ""}
                onChange={(event) =>
                  updateItem(
                    editingIndex!,
                    "captionId",
                    event.target.value,
                  )
                }
                placeholder="Caption Indonesia"
                rows={4}
                className="rounded-2xl border px-4 py-3 text-sm font-semibold outline-none focus:border-[#039147]"
              />
            </div>

            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <label className="flex items-center gap-3 text-sm font-black text-black/60">
                Order
                <input
                  type="number"
                  value={editingItem.sortOrder}
                  onChange={(event) =>
                    updateItem(
                      editingIndex!,
                      "sortOrder",
                      Number(event.target.value) || 0,
                    )
                  }
                  className="w-24 rounded-xl border px-3 py-2"
                />
              </label>

              <button
                type="button"
                onClick={() => removeItem(editingIndex!)}
                className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-black text-red-600 hover:bg-red-600 hover:text-white"
              >
                Remove Image
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
