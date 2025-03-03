import React, { useState, useRef } from "react";
import { Button, IconButton, Modal } from "@mui/material";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Crop as CropIcon,
} from "@mui/icons-material";
import ImageDrawer from "./ImageDrawer";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cropVisible, setCropVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);

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
          uploaded: false,
        };
        setImages((prev) => [...prev, newImage]);
        setSelectedImage(newImage);
        setModalVisible(true);
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

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedData = cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(croppedData);
      const updatedImage = {
        ...selectedImage,
        src: croppedData,
      };
      handleUpdateImage(updatedImage);
      setCropVisible(false);
    }
  };

  const handleCancelCrop = () => {
    setCropVisible(false);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleUploadImage = () => {
    if (selectedImage) {
      const updatedImage = {
        ...selectedImage,
        uploaded: true,
      };
      setImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
      );
      setModalVisible(false);
    }
  };
  const flipTransitionStyle = {
    transition: "transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    transformStyle: "preserve-3d",
    transform: `
      rotateY(${selectedImage?.transformations.horizontalFlip ? 180 : 0}deg) 
      rotateX(${selectedImage?.transformations.verticalFlip ? 180 : 0}deg)
      rotate(${selectedImage?.transformations.rotation}deg)`,
  };
  return (
    <div>
      <Button
        variant="contained"
        component="label"
        style={{
          marginBottom: "20px",
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 16px",
          gap: "4px",
          minWidth: "auto",
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>+</span>
        Add
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <div className="masonry-container">
        {images
          .filter((image) => image.uploaded)
          .map((image) => (
            <div key={image.id} className="masonry-item">
              <img
                src={image.src}
                alt="Uploaded"
                style={{
                  width: "100%",
                  transform: `rotate(${image.transformations.rotation}deg) 
                        ${
                          image.transformations.horizontalFlip
                            ? "scaleX(-1)"
                            : "scaleX(1)"
                        } 
                        ${
                          image.transformations.verticalFlip
                            ? "scaleY(-1)"
                            : "scaleY(1)"
                        }`,
                }}
              />
            </div>
          ))}
      </div>
      <Modal
        open={modalVisible}
        onClose={closeModal}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "900px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2 style={{ margin: 0 }}>Add Asset</h2>
            <IconButton
              onClick={closeModal}
              style={{
                color: "#333",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          {selectedImage && !cropVisible && (
            <div style={{ position: "relative" }}>
              <img
                src={selectedImage.src}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "auto",
                  cursor: "pointer",
                  ...flipTransitionStyle,
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
                  backgroundColor: "#333",
                }}
              >
                {actionsVisible ? <CloseIcon /> : <EditIcon />}
              </IconButton>

              {actionsVisible && !cropVisible && (
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
                    setCropVisible={setCropVisible}
                  />
                </div>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleUploadImage}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <UploadFileIcon />
                Upload Image
              </Button>
            </div>
          )}
          <Modal
            open={cropVisible}
            onClose={handleCancelCrop}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <Cropper
                ref={cropperRef}
                src={selectedImage?.src}
                aspectRatio={1}
                guides={false}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                  onClick={handleCancelCrop}
                  style={{ color: "black" }}
                >
                  <CancelIcon />
                </IconButton>
                <IconButton onClick={handleCrop} style={{ color: "black" }}>
                  <CheckCircleIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Modal>
    </div>
  );
};

export default ImageUploader;
