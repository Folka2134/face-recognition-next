import React, { useEffect, useState } from "react";

type BoundingBox = {
  top_row: number;
  left_col: number;
  bottom_row: number;
  right_col: number;
};

type ImageWithBoundingBoxesProps = {
  imageUrl: string;
  boundingBoxes: BoundingBox[];
};

const DetectedFaces: React.FC<ImageWithBoundingBoxesProps> = ({
  imageUrl,
  boundingBoxes,
}) => {
  const [styles, setStyles] = useState<{ [key: string]: string | number }[]>(
    [],
  );

  // TEST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // console.log(imageUrl);
  // console.log(boundingBoxes);

  useEffect(() => {
    const newStyles = boundingBoxes.map((box: BoundingBox) => {
      return {
        position: "absolute",
        border: "2px solid red",
        top: `${box.top_row * 100}%`,
        left: `${box.left_col * 100}%`,
        width: `${(box.right_col - box.left_col) * 100}%`,
        height: `${(box.bottom_row - box.top_row) * 100}%`,
      };
    });

    setStyles(newStyles);
  }, [boundingBoxes]);

  return (
    <div style={{ position: "relative" }}>
      <img
        src={imageUrl}
        alt="With bounding boxes"
        style={{ width: "100%", height: "auto" }}
      />
      {styles.map((style, index) => (
        <div key={index} className="box" style={style}></div>
      ))}
    </div>
  );
};

export default DetectedFaces;
