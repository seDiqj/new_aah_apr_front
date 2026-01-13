"use client";

import { useEffect, useState } from "react";

const sampleImages = [
  "/preloader1.webp",
  "/preloader2.webp",
  "/preloader3.webp",
  "/preloader4.webp",
  "/preloader5.webp",
];

type ImagePos = {
  src: string;
  left: number;
  top: number;
  rotate: number;
  scale: number;
};

interface Page403Props {
  showAnimation?: boolean;
}

const Page403: React.FC<Page403Props> = ({ showAnimation = true }) => {
  const [show, setShow] = useState(true);
  const [visible, setVisible] = useState(false);
  const [imagePositions, setImagePositions] = useState<ImagePos[]>([]);
  const duration = 3000;

  useEffect(() => {
    if (!showAnimation) {
      setShow(false);
      return;
    }

    const count = 80;
    const size = 100;
    const positions: ImagePos[] = Array(count)
      .fill(0)
      .map((_, i) => {
        const rotate = Math.random() * 20 - 10;
        const scale = 0.8 + Math.random() * 0.4;
        return {
          src: sampleImages[i % sampleImages.length],
          left: Math.random() * (window.innerWidth - size),
          top: Math.random() * (window.innerHeight - size),
          rotate,
          scale,
        };
      });

    setImagePositions(positions);

    const fadeIn = setTimeout(() => setVisible(true), 50);
  }, [showAnimation]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden transition-all duration-500 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {imagePositions.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={`bg-${i}`}
          className="absolute rounded-lg shadow-lg object-cover transition-all duration-500"
          style={{
            width: 100,
            height: 100,
            left: img.left,
            top: img.top,
            transform: `rotate(${img.rotate}deg) scale(${img.scale})`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-green-400 dark:bg-[#00bfff] opacity-80 mix-blend-screen transition-opacity duration-500"></div>

      <div className="relative z-10 text-center text-white flex flex-col items-center">
        <img
          src="/AAHLogo.png"
          alt="logo"
          className="w-38 h-36 brightness-125 rounded-full shadow-xl mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">403 - Access Denied</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Page403;
