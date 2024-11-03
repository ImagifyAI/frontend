const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      console.log('Starting fetchImages');

      const response = await fetch('https://backend.lokesh.cloud/api/images', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${authToken}` 
        }
      });

      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`Failed to fetch images: ${response.status}`);

      const data = await response.json();
      console.log('Received data:', data);
      setImages(data.images || []);
    } catch (err) {
      console.error('FetchImages error:', err);
      setError('Failed to load images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch('/cdn-cgi/access/get-identity');
        const data = await response.json();
        console.log('Identity data:', data);
        
        setUserInfo({
          email: data.email,
          id: data.email
        });
        setAuthToken(data.token); 
        
        if (data.token) {
          fetchImages();
        }
      } catch (err) {
        console.error('Failed to get identity:', err);
        setError('Failed to authenticate');
      }
    };

    initialize();
  }, []); 

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('uploading');

      const response = await fetch('https://backend.lokesh.cloud/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'Authorization': `Bearer ${authToken}` 
        },
        credentials: 'include',
        body: file
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Upload failed');
      }

      setUploadStatus('success');
      await fetchImages();
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      setUploadStatus('error');
      setError(err.message);
      console.error('Upload error:', err);
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