import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const getAccessToken = async () => {
    return new Promise((resolve) => {
      const checkToken = () => {
        if (window.location.href.includes('token=')) {
          const urlParams = new URLSearchParams(window.location.search);
          resolve(urlParams.get('token'));
        }
        else if (window.CF_ACCESS_TOKEN) {
          resolve(window.CF_ACCESS_TOKEN);
        } else {
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    });
  };

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const response = await fetch('https://backend.lokesh.cloud/api/images', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserInfo = useCallback(async () => {
    try {
      const response = await fetch('/cdn-cgi/access/get-identity');
      if (!response.ok) throw new Error('Failed to get user identity');
      const data = await response.json();

      setUserInfo({
        email: data.email,
        id: data.sub || data.email
      });

      return data;
    } catch (err) {
      console.error('Failed to get user identity:', err);
      setError('Authentication failed');
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      const user = await getUserInfo();
      if (user) {
        fetchImages();
      }
    };

    initializeUser();
  }, [getUserInfo, fetchImages]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('uploading');
      const token = await getAccessToken();

      const response = await fetch('https://backend.lokesh.cloud/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': file.type,
        },
        body: file,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadStatus('success');
      fetchImages();
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      setUploadStatus('error');
      setError('Failed to upload image');
      console.error(err);
    }
  };

  return (
    <div className="gallery-container">
      <nav className="gallery-nav">
        <div className="nav-content">
          <h1>Image Gallery</h1>
          {userInfo && (
            <div className="user-info">
              <div className="user-avatar">
                {userInfo.email[0].toUpperCase()}
              </div>
              <span className="user-email">{userInfo.email}</span>
            </div>
          )}
        </div>
      </nav>

      <main className="gallery-main">
        <div className="upload-section">
          <h2>Upload Images</h2>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            onChange={handleImageUpload}
            className="file-input"
          />
          <label htmlFor="imageInput" className="upload-label">
            <div className="upload-area">
              <div className="upload-content">
                <div className="upload-icon">+</div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </label>

          {uploadStatus === 'uploading' && (
            <div className="status-message uploading">
              Uploading
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="status-message success">
              Upload successful
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="status-message error">
              {error}
            </div>
          )}
        </div>

        <div className="gallery-content">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="image-grid">
              {images.map((image) => (
                <div key={image.id} className="image-card">
                  <img
                    src={`https://backend.lokesh.cloud/images/${image.filename}`}
                    alt={`Uploaded on ${new Date(image.upload_date).toLocaleDateString()}`}
                  />
                  <div className="image-info">
                    <span className="upload-date">
                      {new Date(image.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && images.length === 0 && (
            <div className="empty-state">
              <p>No images uploaded yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div>
      <ImageGallery />
    </div>
  );
}

export default App;