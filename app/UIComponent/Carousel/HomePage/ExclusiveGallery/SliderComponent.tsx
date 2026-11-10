"use client";
import Marquee from "react-fast-marquee";
import OpenImage from "@/app/galleries/pictures/OpenImage";
import Image from "next/image";
import { CSSProperties, useState } from "react";
import { getImageSize } from "@/app/Utility/lib/image-sizes";
export default function SliderComponent({
  allImagePath,
  path
}: any) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return <>
    {" "}
    <div
      style={{
        width: "100",
        margin: "0 auto",

        overflow: "hidden",
      }}
    >
      {/* Marquee with dynamic pauseOnHover based on state */}
      <Marquee
        gradient={false}
        speed={open ? 0 : 50}
        loop={0}
        pauseOnHover={true}
      >
        {allImagePath.map((src: any, index: any) => {
          const imageUrl = path + "/" + src;
          const size = getImageSize(imageUrl);
          return (
          <div key={index} style={styles.card} className="cursor-pointer">
            <Image
              src={imageUrl}
              alt={`Carousel ${index + 1}`}
              onClick={() => {
                setSelectedImageIndex(index);
                setOpen(true);
              }}
              width={size?.width || 250}
              height={size?.height || 200}
              style={styles.image}
              sizes="250px"
              loading="lazy"
              fetchPriority="low"
              className="cursor-pointer rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </div>
          );
        })}
      </Marquee>
    </div>
    {open && (
      <OpenImage
        key={selectedImageIndex}
        imagePath={path}
        startIndex={selectedImageIndex}
        open={open}
        handleClose={handleClose}
        data={allImagePath}
      />
    )}
  </>;
}

const styles:{
  button:CSSProperties
  card:CSSProperties
  image:CSSProperties
} = {
  button: {
    margin: "20px",
    padding: "10px 20px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    minWidth: "250px",
    height: "200px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "10px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
    borderRadius: "5px",
  },
};
