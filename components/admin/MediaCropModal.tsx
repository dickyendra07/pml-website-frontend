"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

import { resolveMediaUrl } from "@/lib/media";

type RatioOption = {
  label: string;
  value: "16-9" | "4-3" | "1-1";
  ratio: number;
  width: number;
  height: number;
  usage: string;
};

const ratioOptions: RatioOption[] = [
  {
    label: "16:9",
    value: "16-9",
    ratio: 16 / 9,
    width: 1600,
    height: 900,
    usage: "Hero banners and wide layouts",
  },
  {
    label: "4:3",
    value: "4-3",
    ratio: 4 / 3,
    width: 1200,
    height: 900,
    usage: "Content cards and editorial images",
  },
  {
    label: "1:1",
    value: "1-1",
    ratio: 1,
    width: 1000,
    height: 1000,
    usage: "Square thumbnails and compact cards",
  },
];

export type MediaCropPayload = {
  ratio: string;
  width: number;
  height: number;
  x: number;
  y: number;
  cropWidth: number;
  cropHeight: number;
};

type Props = {
  imageUrl: string;
  processing?: boolean;
  onClose: () => void;
  onSave: (payload: MediaCropPayload) => void | Promise<void>;
};

export default function MediaCropModal({
  imageUrl,
  processing = false,
  onClose,
  onSave,
}: Props) {
  const [selectedRatio, setSelectedRatio] = useState(ratioOptions[0]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit image crop"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:rounded-[34px]"
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              Image Editor
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Edit Crop
            </h2>
            <p className="mt-1 text-xs font-semibold text-black/40 sm:text-sm">
              Drag the image and zoom until the important area is framed.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            aria-label="Close crop editor"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-xl font-black disabled:opacity-40"
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:overflow-hidden">
          <div className="relative h-[48vh] min-h-[340px] overflow-hidden rounded-[26px] bg-[#101510] lg:h-auto">
            <Cropper
              image={resolveMediaUrl(imageUrl)}
              crop={crop}
              zoom={zoom}
              aspect={selectedRatio.ratio}
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => {
                setArea(croppedAreaPixels);
              }}
            />
          </div>

          <aside className="rounded-[24px] bg-[#f6faf7] p-5 lg:overflow-y-auto">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              Aspect Ratio
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
              {ratioOptions.map((item) => {
                const active = selectedRatio.value === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedRatio(item)}
                    disabled={processing}
                    className={`rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#039147] bg-[#eaf8f0]"
                        : "border-black/5 bg-white hover:border-[#039147]/30"
                    }`}
                  >
                    <span className="block text-sm font-black text-black">
                      {item.label}
                    </span>
                    <span className="mt-1 hidden text-[10px] font-semibold leading-4 text-black/35 lg:block">
                      {item.usage}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="media-crop-zoom"
                  className="text-xs font-black uppercase tracking-[0.14em] text-black/45"
                >
                  Zoom
                </label>
                <span className="text-xs font-black text-[#039147]">
                  {zoom.toFixed(1)}×
                </span>
              </div>
              <input
                id="media-crop-zoom"
                className="mt-3 w-full accent-[#039147]"
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                disabled={processing}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold text-black/35">Output</p>
              <p className="mt-1 text-sm font-black text-black">
                {selectedRatio.width} × {selectedRatio.height}px
              </p>
              <p className="mt-2 text-[11px] leading-5 text-black/40">
                Saved as a new WebP variant. The original image remains unchanged.
              </p>
            </div>

            {processing ? (
              <div className="mt-5">
                <p className="text-xs font-black text-[#039147]">
                  Processing image…
                </p>
                <div className="mt-2 overflow-hidden rounded-full bg-[#dceee3]">
                  <div className="h-1.5 w-2/3 animate-pulse rounded-full bg-[#039147]" />
                </div>
              </div>
            ) : null}

            <button
              type="button"
              disabled={!area || processing}
              onClick={() => {
                if (!area) return;

                void onSave({
                  ratio: selectedRatio.value,
                  width: selectedRatio.width,
                  height: selectedRatio.height,
                  x: Math.round(area.x),
                  y: Math.round(area.y),
                  cropWidth: Math.round(area.width),
                  cropHeight: Math.round(area.height),
                });
              }}
              className="mt-6 w-full rounded-full bg-[#039147] px-6 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(3,145,71,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processing ? "Saving Variant…" : "Save Variant"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="mt-3 w-full rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-black disabled:opacity-40"
            >
              Cancel
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
