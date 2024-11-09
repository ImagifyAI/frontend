# ImagifyAI Frontend

## Project Overview
ImagefyAI is a web application that provides image processing services to users. The frontend is a React-based web application running on Cloudflare Pages. The frontend provides a user-friendly interface for users to upload images, select processing options, and view the processed images. The frontend communicates with the backend API to process the images and display the results to the user. The backend is running on Cloudflare Workers in conjunction with Cloudflare D1, Cloudflare R2, Cloudflare Workers AI for handling user registration, authentication, session handling, processing and storage of images, tagging the images using resnet50 model, searching images based on tags, and serving the processed images to the frontend.

## Repository Overview
The ImagifyAI Frontend is a React-based web application designed to provide a seamless user experience for interacting with ImagifyAI's image processing services. This frontend is hosted on Cloudflare Pages for fast, reliable, and globally distributed delivery, ensuring optimal performance and scalability. Note that this repository is a part of the ImagifyAI project and is intended to be used in conjunction with the ImagifyAI backend and other related services.

## Tech Stack
- Framework: React (v18.2.0)
- Styling: Styled-Components
- Routing: React Router DOM (v6.4.0)
- HTTP Client: Axios (v1.7.7)

## Computing Stack - Frontend
This project leverages Cloudflare's serverless architecture to ensure a secure, performant, and resilient frontend-backend interaction.

### Cloudflare Pages
#### Purpose: 
Hosts the frontend application, serving static assets (HTML, CSS, JavaScript) with global distribution across Cloudflare’s edge network.

#### Key Benefits:
- Global Edge Network: Cloudflare Pages automatically deploys the static assets to Cloudflare's global edge network, ensuring that users can load the application quickly from the nearest server.
- Automated CI/CD: Cloudflare Pages integrates with GitHub for seamless continuous deployment. Each change pushed to the repository triggers a build and deployment process, automatically updating the live site.
- Scalability: As a serverless platform, Cloudflare Pages scales with demand, automatically handling traffic spikes without the need for manual scaling.
- Minified Assets: During the build process, the JavaScript, CSS, and HTML files are minified, reducing file sizes for faster load times.
- DDoS Protection: Cloudflare’s integrated DDoS protection safeguards the application from malicious traffic, ensuring the frontend remains available to legitimate users.
- Automatic HTTPS: Cloudflare Pages automatically configures HTTPS, providing end-to-end encryption, security for users, and improved SEO.
- Content Security Policies: Content Security Policy (CSP) headers can be set up to restrict where resources can be loaded from, providing an additional security layer against attacks like Cross-Site Scripting (XSS).
- Preview Deployments for Testing: Every pull request generates a unique preview URL, enabling team members to review changes before merging. This feature supports rapid feedback cycles, QA testing, and stakeholder reviews without affecting the production environment.
- Rollback Capabilities: Cloudflare Pages allows for easy rollbacks, so if an issue arises in production, it can be quickly resolved by deploying the previous version.

#### How It Works:

- Build Process: Each deployment follows a build command (npm run build) that compiles the React app into optimized static files. These files are then uploaded to Cloudflare Pages.
- Edge Caching and CDN: Cloudflare Pages caches the assets (HTML, CSS, JavaScript) on the edge network, reducing load times and ensuring reliability.
- Preview Deployments: Cloudflare Pages automatically generates preview links for each pull request, enabling testing and feedback before merging to production.

## Folder Structure
```
frontend/
├── public/                  # Public assets
│   ├── index.html           # Main HTML file
│   ├── favicon.ico          # Favicon
│   └── manifest.json        # Web app manifest
├── src/                     # Source code
│   ├── index.js             # Application entry point
│   ├── App.js               # Root component
│   ├── App.css              # Global styling for the App component
│   ├── index.css            # Global styles applied to the root
│   ├── logo.svg             # Logo asset for the application
│   ├── api.js               # API request handlers (using Axios)
│   ├── reportWebVitals.js   # Performance reporting
│   ├── setupTests.js        # Test setup configuration
│   ├── script.js            # Additional scripts for functionality
│   ├── style.css            # Additional global styles
│   ├── components/          # Reusable React components
│   │   ├── Navbar.js        # Navbar component
│   │   ├── ImageGallery.js  # Component for displaying an image gallery
│   │   ├── AuthForm.js      # Component for authentication forms
│   │   ├── ImageUpload.js   # Component for image upload functionality
│   │   └── HomePage.js      # Homepage component
│   ├── pages/               # Main page components (if any exist, not found here)
│   ├── services/            # API services (api.js is the main API handler here)
│   └── styles/              # Global and shared styles
│       └── GlobalStyles.js  # Shared global styling for the app
├── .gitignore               # Git ignore file
├── package.json             # Project configuration and dependencies
└── README.md                # Project documentation
```

### How It Works
- UI Components: Built using reusable components from the src/components directory, structured to ensure modularity.
- Routing: Uses React Router for seamless navigation.
- State Management: Each component handles its own state, with data fetched on demand.
- API Interaction: src/api.js contains functions for handling HTTP requests to the backend API, securely routed via Cloudflare Workers.

### Development & Contribution
Clone the Repository:

```bash
git clone https://github.com/ImagifyAI/frontend.git
```

Navigate to the Project Directory:
```bash
cd frontend
```

Install Dependencies:
```bash
npm install
```

Start Development Server:
```bash
npm start
```

### To Do
- **Use Cloudflare Images to implement image processing feature, allowing users to select multiple images for conversion to different formats**
- **Use Cloudflare Durable Objects for storing image processing session data, enabling users to resume processing sessions across devices**