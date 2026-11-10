"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { ReactSVG } from "react-svg";
import type { HomeCarouselSlide } from "@/app/homepage/types";
import Image from "next/image";
import Link from "next/link";
import { getImageSize } from "@/app/Utility/lib/image-sizes";

type LegacyProps = {
  data?: string[];
  url?: string;
  path1?: string;
};

type Props = LegacyProps & {
  slides?: HomeCarouselSlide[];
};

export default function HomePageCarousel({
  data = [],
  url = "",
  slides = [],
}: Props) {
  const normalizedSlides: HomeCarouselSlide[] =
    slides.length > 0
      ? slides
      : data.map((item) => ({
          imageUrl: `${url}/${item}`,
          altText: "BES Homepage Slide",
          target: "_self",
        }));

  if (!normalizedSlides.length) return null;

  const isInternalUrl = (value: string) => value.startsWith("/");
  const isSvg = (value: string) => value.toLowerCase().includes(".svg");

  const renderSlideImage = (slide: HomeCarouselSlide, index: number) => {
    if (isSvg(slide.imageUrl)) {
      return <ReactSVG src={slide.imageUrl} />;
    }

    const size = getImageSize(slide.imageUrl);
    const width = size?.width || slide.width || 1600;
    const height = size?.height || slide.height || 900;

    return (
      <Image
        src={slide.imageUrl}
        width={width}
        height={height}
        className="w-full min-w-full object-contain h-auto"
        alt={slide.altText || "BES Homepage Slide"}
        priority={index === 0}
        fetchPriority={index === 0 ? "high" : "low"}
        loading={index === 0 ? "eager" : "lazy"}
        sizes="(max-width: 880px) 100vw, calc(100vw - 528px)"
      />
    );
  };

  return (
    <div>
      <Carousel
        autoPlay={true}
        animation={"slide"}
        indicators={false}
        key={normalizedSlides.length}
        stopAutoPlayOnHover={true}
        interval={5000}
      >
        {normalizedSlides.map((slide, key) => (
          <div className="w-full cursor-pointer" key={key}>
            {slide?.clickUrl ? (
              isInternalUrl(slide.clickUrl) ? (
                <Link href={slide.clickUrl} target={slide.target || "_self"}>
                  {renderSlideImage(slide, key)}
                </Link>
              ) : (
                <a
                  href={slide.clickUrl}
                  target={slide.target || "_self"}
                  rel={
                    slide.target === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {renderSlideImage(slide, key)}
                </a>
              )
            ) : (
              renderSlideImage(slide, key)
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
