import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  RotateRight as RotateRightIcon,
  FlipToFront as FlipHorizontalIcon,
  FlipToBack as FlipVerticalIcon,
  FindReplace as FindReplaceIcon,
  Crop as CropIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "white",
    color: "black",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: "0.9rem",
  },
}));

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
      <CustomTooltip title="Rotate" placement="left">
        <IconButton onClick={handleRotate} style={{ color: "white" }}>
          <RotateRightIcon />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Flip Horizontal" placement="left">
        <IconButton onClick={handleFlipHorizontal} style={{ color: "white" }}>
          <FlipHorizontalIcon />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Flip Vertical" placement="left">
        <IconButton onClick={handleFlipVertical} style={{ color: "white" }}>
          <FlipVerticalIcon />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Replace" placement="left">
        <IconButton component="label" style={{ color: "white" }}>
          <FindReplaceIcon />
          <input
            type="file"
            accept="image/*"
            onChange={handleReplaceImage}
            style={{ display: "none" }}
          />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Crop" placement="left">
        <IconButton
          onClick={() => setCropVisible(true)}
          style={{ color: "white" }}
        >
          <CropIcon />
        </IconButton>
      </CustomTooltip>
    </div>
  );
};

export default ImageDrawer;
