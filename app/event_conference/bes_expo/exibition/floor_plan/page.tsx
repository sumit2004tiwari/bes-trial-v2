import styles from "@/app/about_bes/content.module.css";
import { getImageSize } from "@/app/Utility/lib/image-sizes";
import ZoomableImage from "./zoomable-image";

const FLOOR_PLAN_SRC = "/Images/common/Floor-Plan-2027.jpg";
const DEFAULT_ASPECT_RATIO = "1241 / 1754";

export default function page() {
  const size = getImageSize(FLOOR_PLAN_SRC);
  const aspectRatio = size
    ? `${size.width} / ${size.height}`
    : DEFAULT_ASPECT_RATIO;

  return (
    <div
      className={"flex flex-col max-w-[1100px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Floor Plan</h2>

      <div>
        <p>
          <strong>BES EXPO 2027 </strong>is being organized at Bharat Mandapam,
          New Delhi.
        </p>
      </div>

      <ZoomableImage
        src={FLOOR_PLAN_SRC}
        alt="BES EXPO 2027 Floor Plan"
        aspectRatio={aspectRatio}
        minZoom={1}
        maxZoom={5}
      />
      <p>
      <br/>    <strong>Note: Subject to availability of Space</strong>
        </p>
    </div>
  );
}
