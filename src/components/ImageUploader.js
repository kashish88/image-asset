import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import ImageDrawer from "./ImageDrawer";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionsVisible, setActionsVisible] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          src: e.target.result,
          transformations: {
            crop: null,
            rotation: 0,
            horizontalFlip: false,
            verticalFlip: false,
          },
        };
        setImages((prev) => [...prev, newImage]);
        setSelectedImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = (updatedImage) => {
    setImages((prev) =>
      prev.map((img) => (img.id === updatedImage.id ? updatedImage : img))
    );
    setSelectedImage(updatedImage);
  };

  return (
    <div>
      <Button
        variant="contained"
        component="label"
        style={{ marginBottom: "20px" }}
      >
        Add
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {selectedImage && (
        <div style={{ position: "relative" }}>
          <img
            src={selectedImage.src}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "auto",
              cursor: "pointer",
              transform: `rotate(${selectedImage.transformations.rotation}deg) 
                          ${
                            selectedImage.transformations.horizontalFlip
                              ? "scaleX(-1)"
                              : "scaleX(1)"
                          } 
                          ${
                            selectedImage.transformations.verticalFlip
                              ? "scaleY(-1)"
                              : "scaleY(1)"
                          }`,
            }}
            onClick={() => setActionsVisible((prev) => !prev)}
          />

          <IconButton
            onClick={() => setActionsVisible((prev) => !prev)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
              zIndex: 1,
            }}
          >
            {actionsVisible ? <CloseIcon /> : <EditIcon />}
          </IconButton>

          {actionsVisible && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "10px",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <ImageDrawer
                image={selectedImage}
                onUpdateImage={handleUpdateImage}
                onClose={() => setActionsVisible(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
