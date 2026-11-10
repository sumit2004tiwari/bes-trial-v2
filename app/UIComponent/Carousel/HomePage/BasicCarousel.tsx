"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";

export default function BasicCarousel(props: any) {
  const { children, ...rest } = props;
  return (
    <>
      <Carousel {...rest}>{children}</Carousel>
    </>
  );
}
