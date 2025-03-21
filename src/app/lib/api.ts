import { File, SystemStatus } from "../types/";

// API base URL - this should match your backend URL
//const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';
const API_BASE = 'https://p2p-network-backend.onrender.com/api';
console.log("API connecting to:", API_BASE);

// Get available files
export async function getAvailableFiles(): Promise<File[]> {
  try {
    console.log("Fetching available files from API");
    const response = await fetch(`${API_BASE}/files`);
    
    if (!response.ok) {
      throw new Error(`Error fetching files: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Files response:", data);
    
    // Check if we have an array of strings and convert to File objects
    if (data.files && Array.isArray(data.files)) {
      if (data.files.length > 0 && typeof data.files[0] === 'string') {
        // Convert string array to File objects with proper type annotation
        const fileObjects = data.files.map((filename: string) => ({ 
          filename,
          // Optional: You could add default values for other properties
          // size: 0,
          // seeders: 0
        }));
        console.log("Converted file objects:", fileObjects);
        return fileObjects;
      }
      return data.files; // Already in correct format
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch available files:', error);
    return [];
  }
}

// Get system status
export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    console.log("Fetching system status from API");
    const response = await fetch(`${API_BASE}/status`);
    
    if (!response.ok) {
      throw new Error(`Error fetching status: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Status response:", data);
    return data;
  } catch (error) {
    console.error('Failed to fetch system status:', error);
    return {
      downloads: {
        current_downloads: [],
        completed_downloads: []
      },
      tracker: {
        address: 'Not connected'
      },
      error: 'Failed to connect to backend'
    };
  }
}

// Start downloading a file
export async function downloadFile(filename: string): Promise<boolean> {
  try {
    console.log("Requesting download for file:", filename);
    const response = await fetch(`${API_BASE}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    });
    
    if (!response.ok) {
      throw new Error(`Error starting download: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Download response:", data);
    return data.success || false;
  } catch (error) {
    console.error(`Failed to start download for ${filename}:`, error);
    return false;
  }
}

// Get downloaded files
export async function getDownloadedFiles(): Promise<string[]> {
  try {
    console.log("Fetching downloaded files");
    const response = await fetch(`${API_BASE}/downloaded`);
    
    if (!response.ok) {
      throw new Error(`Error fetching downloaded files: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Downloaded files response:", data);
    return data.files || [];
  } catch (error) {
    console.error('Failed to fetch downloaded files:', error);
    return [];
  }
}

// Configure tracker
export async function configureTracker(trackerIp: string, trackerPort: string, startLocalTracker: boolean): Promise<boolean> {
  try {
    console.log("Configuring tracker:", { trackerIp, trackerPort, startLocalTracker });
    const response = await fetch(`${API_BASE}/configure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackerIp, trackerPort, startLocalTracker }),
    });
    
    if (!response.ok) {
      throw new Error(`Error configuring tracker: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Configuration response:", data);
    return data.success || false;
  } catch (error) {
    console.error(`Failed to configure tracker:`, error);
    return false;
  }
}

// Download a file directly to the browser
export async function downloadFileToClient(filename: string): Promise<boolean> {
  try {
    console.log("Starting browser download for file:", filename);
    
    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Track when the iframe is loaded
    return new Promise((resolve) => {
      iframe.onload = () => {
        console.log("iframe loaded, download should have started");
        
        // Clean up after a delay to ensure download starts
        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve(true);
        }, 1000);
      };
      
      // Set the iframe source to the file URL which triggers the download
      iframe.src = `${API_BASE}/files/${filename}`;
      
      // Handle potential errors (e.g., if file not found)
      iframe.onerror = () => {
        console.error("iframe failed to load");
        document.body.removeChild(iframe);
        resolve(false);
      };
      
      // Fallback if onload doesn't trigger within 5 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          console.log("Removing iframe after timeout");
          document.body.removeChild(iframe);
          resolve(true); // Assume it worked, even if we're not sure
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error(`Failed to download file ${filename} to browser:`, error);
    return false;
  }
}