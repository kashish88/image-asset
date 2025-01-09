import React from "react";
import { IconButton } from "@mui/material";
import {
  RotateRight as RotateRightIcon,
  FlipToFront as FlipHorizontalIcon,
  FlipToBack as FlipVerticalIcon,
  FindReplace as FindReplaceIcon,
  Crop as CropIcon,
} from "@mui/icons-material";

const ImageDrawer = ({ image, onUpdateImage, onClose, setCropVisible }) => {
  const [rotation, setRotation] = React.useState(
    image.transformations.rotation
  );
  const [flipHorizontal, setFlipHorizontal] = React.useState(
    image.transformations.horizontalFlip
  );
  const [flipVertical, setFlipVertical] = React.useState(
    image.transformations.verticalFlip
  );

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    applyTransformations(newRotation, flipHorizontal, flipVertical);
  };

  const handleFlipHorizontal = () => {
    const newFlipHorizontal = !flipHorizontal;
    setFlipHorizontal(newFlipHorizontal);
    applyTransformations(rotation, newFlipHorizontal, flipVertical);
  };

  const handleFlipVertical = () => {
    const newFlipVertical = !flipVertical;
    setFlipVertical(newFlipVertical);
    applyTransformations(rotation, flipHorizontal, newFlipVertical);
  };

  const applyTransformations = (rotation, flipHorizontal, flipVertical) => {
    const updatedImage = {
      ...image,
      transformations: {
        rotation,
        horizontalFlip: flipHorizontal,
        verticalFlip: flipVertical,
      },
    };
    onUpdateImage(updatedImage);
  };
  const handleReplaceImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        ...image,
        src: URL.createObjectURL(file),
      };
      onUpdateImage(newImage);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "#333",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <IconButton onClick={handleRotate} style={{ color: "white" }}>
        <RotateRightIcon />
      </IconButton>
      <IconButton onClick={handleFlipHorizontal} style={{ color: "white" }}>
        <FlipHorizontalIcon />
      </IconButton>
      <IconButton onClick={handleFlipVertical} style={{ color: "white" }}>
        <FlipVerticalIcon />
      </IconButton>
      <IconButton component="label" style={{ color: "white" }}>
        <FindReplaceIcon />
        <input
          type="file"
          accept="image/*"
          onChange={handleReplaceImage}
          style={{ display: "none" }}
        />
      </IconButton>
      <IconButton
        onClick={() => setCropVisible(true)}
        style={{ color: "white" }}
      >
        <CropIcon />
      </IconButton>
    </div>
  );
};

export default ImageDrawer;
