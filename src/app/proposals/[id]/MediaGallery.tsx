"use client";

import { useState } from "react";

interface Media {
  id: number;
  url: string;
  type: string;
  filename: string;
}

export default function MediaGallery({ media }: { media: Media[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = media.filter((m) => m.type === "IMAGE");
  const videos = media.filter((m) => m.type === "VIDEO");

  return (
    <>
      {/* Галерея */}
      <div className="bg-gray-100">
        {images.length === 1 && (
          <img
            src={images[0].url}
            alt=""
            className="w-full max-h-[500px] object-cover cursor-pointer"
            onClick={() => setSelectedIndex(0)}
          />
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {images.map((img, i) => (
              <img
                key={img.id}
                src={img.url}
                alt=""
                className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition"
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        )}

        {images.length >= 3 && (
          <div className="grid grid-cols-3 gap-1">
            <img
              src={images[0].url}
              alt=""
              className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition col-span-2 row-span-2"
              onClick={() => setSelectedIndex(0)}
            />
            {images.slice(1, 3).map((img, i) => (
              <div key={img.id} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-[calc(144px-2px)] object-cover cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedIndex(i + 1)}
                />
                {i === 1 && images.length > 3 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={() => setSelectedIndex(2)}
                  >
                    <span className="text-white font-bold text-xl">
                      +{images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Видеолар */}
        {videos.map((video) => (
          <video
            key={video.id}
            src={video.url}
            controls
            className="w-full max-h-[400px]"
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
            onClick={() => setSelectedIndex(null)}
          >
            ✕
          </button>

          {/* Алдыңғы */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
            >
              ‹
            </button>
          )}

          {/* Сурет */}
          <img
            src={images[selectedIndex].url}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Келесі */}
          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
            >
              ›
            </button>
          )}

          {/* Санағыш */}
          <div className="absolute bottom-4 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
