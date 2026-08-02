"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { resolveMediaUrl } from "@/lib/media";

type RatioOption = {
  label: string;
  value: string;
  ratio: number;
  width: number;
  height: number;
};

const ratioOptions: RatioOption[] = [
  {
    label: "Original",
    value: "original",
    ratio: 4 / 3,
    width: 1200,
    height: 900,
  },
  {
    label: "16:9",
    value: "16-9",
    ratio: 16 / 9,
    width: 1600,
    height: 900,
  },
  {
    label: "4:3",
    value: "4-3",
    ratio: 4 / 3,
    width: 1200,
    height: 900,
  },
  {
    label: "1:1",
    value: "1-1",
    ratio: 1,
    width: 1000,
    height: 1000,
  },
  {
    label: "3:4",
    value: "3-4",
    ratio: 3 / 4,
    width: 900,
    height: 1200,
  },
];

type Props = {
  imageUrl: string;
  onClose: () => void;
  onSave: (payload: {
    ratio: string;
    width: number;
    height: number;
    x: number;
    y: number;
  }) => void;
};

export default function MediaCropModal({
  imageUrl,
  onClose,
  onSave,
}: Props) {
  const [selectedRatio, setSelectedRatio] = useState(ratioOptions[1]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        
        <div className="border-b p-6">
          <h2 className="text-xl font-black">
            Crop Image
          </h2>
          <p className="mt-1 text-sm font-bold text-black/40">
            Choose image ratio before saving.
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]">

          <div className="relative h-[520px] overflow-hidden rounded-3xl bg-black">
            <Cropper
              image={resolveMediaUrl(imageUrl)}
              crop={crop}
              zoom={zoom}
              aspect={selectedRatio.ratio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => {
                setArea(croppedAreaPixels);
              }}
            />
          </div>


          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#039147]">
              Ratio
            </p>

            <div className="flex flex-wrap gap-2">
              {ratioOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedRatio(item)}
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    selectedRatio.value === item.value
                      ? "bg-[#039147] text-white"
                      : "border border-black/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>


            <div className="mt-8">
              <label className="text-xs font-black uppercase">
                Zoom
              </label>

              <input
                className="mt-3 w-full"
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) =>
                  setZoom(Number(e.target.value))
                }
              />
            </div>


            <button
              type="button"
              onClick={() => {
                if (!area) return;

                onSave({
                  ratio: selectedRatio.value,
                  width: selectedRatio.width,
                  height: selectedRatio.height,
                  x: area.x,
                  y: area.y,
                });
              }}
              className="mt-8 w-full rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white"
            >
              Save Crop
            </button>


            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-full border border-black/10 px-6 py-3 text-sm font-black"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
