document.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("login-button");
    const uploadSection = document.getElementById("upload-section");
    const gallerySection = document.getElementById("gallery-section");
    const fileInput = document.getElementById("file-input");
    const uploadButton = document.getElementById("upload-button");
    const uploadStatus = document.getElementById("upload-status");
    const imageGallery = document.getElementById("image-gallery");
  
    const isAuthenticated = await checkAuthentication();
    if (isAuthenticated) {
      loginButton.style.display = "none";
      uploadSection.style.display = "block";
      gallerySection.style.display = "block";
      loadUserImages();
    } else {
      loginButton.style.display = "block";
    }
  
    loginButton.addEventListener("click", () => {
      window.location.href = "/"; 
    });
  
    uploadButton.addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (!file) {
        uploadStatus.textContent = "Please select an image first";
        return;
      }
  
      uploadStatus.textContent = "Uploading";
      const success = await uploadImage(file);
      if (success) {
        uploadStatus.textContent = "Image uploaded successfully";
        loadUserImages(); 
      } else {
        uploadStatus.textContent = "Image upload failed";
      }
    });
  });
  
  async function checkAuthentication() {
    try {
      const response = await fetch("/api/images");
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    return response.ok;
  }
  
  async function loadUserImages() {
    const response = await fetch("/api/images");
    if (!response.ok) return;
  
    const data = await response.json();
    const imageGallery = document.getElementById("image-gallery");
    imageGallery.innerHTML = "";
  
    data.images.forEach(image => {
      const img = document.createElement("img");
      img.src = `/api/image/${image.filename}`; 
      img.alt = `Uploaded on ${image.upload_date}`;
      img.classList.add("gallery-image");
      imageGallery.appendChild(img);
    });
  }
  