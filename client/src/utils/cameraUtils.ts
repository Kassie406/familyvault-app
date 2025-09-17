// Camera Utilities & Barcode Detection
// Mobile-optimized camera functionality for Trustworthy Upload Center

// Camera Access and Management
export class CameraManager {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private facingMode: 'environment' | 'user' = 'environment'; // Start with back camera

  // Initialize camera with optimal settings for document scanning
  async initializeCamera(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<boolean> {
    try {
      this.video = videoElement;
      this.canvas = canvasElement;
      this.context = canvasElement.getContext('2d');

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          aspectRatio: { ideal: 16/9 }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;

      return new Promise((resolve) => {
        this.video!.onloadedmetadata = () => {
          resolve(true);
        };
      });

    } catch (error) {
      console.error('Camera initialization failed:', error);
      throw new Error(this.getCameraErrorMessage(error as DOMException));
    }
  }

  // Switch between front and back camera
  async switchCamera(): Promise<boolean> {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    
    if (this.stream) {
      this.stopCamera();
    }
    
    return await this.initializeCamera(this.video!, this.canvas!);
  }

  // Capture high-quality photo optimized for document scanning
  capturePhoto(options: {
    quality?: number;
    format?: string;
    maxWidth?: number;
    maxHeight?: number;
    filename?: string;
  } = {}): Promise<{
    file: File;
    imageUrl: string;
    width: number;
    height: number;
  }> {
    if (!this.video || !this.canvas) {
      throw new Error('Camera not initialized');
    }

    const {
      quality = 0.95,
      format = 'image/jpeg',
      filename = `document_${Date.now()}.jpg`
    } = options;

    // Set canvas dimensions to video dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw video frame to canvas
    this.context!.drawImage(this.video, 0, 0);

    // Apply document enhancement filters
    this.enhanceDocumentImage();

    // Convert to blob with specified quality
    return new Promise((resolve) => {
      this.canvas!.toBlob((blob) => {
        if (!blob) throw new Error('Failed to capture image');
        const file = new File([blob], filename, { type: format });
        const imageUrl = URL.createObjectURL(blob);
        
        resolve({
          file,
          imageUrl,
          width: this.canvas!.width,
          height: this.canvas!.height
        });
      }, format, quality);
    });
  }

  // Enhance captured image for better document readability
  private enhanceDocumentImage(): void {
    if (!this.context || !this.canvas) return;

    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    // Apply contrast and brightness enhancement
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      data[i] = this.adjustContrast(data[i], 1.2);     // Red
      data[i + 1] = this.adjustContrast(data[i + 1], 1.2); // Green
      data[i + 2] = this.adjustContrast(data[i + 2], 1.2); // Blue
      
      // Slight brightness increase
      data[i] = Math.min(255, data[i] + 10);
      data[i + 1] = Math.min(255, data[i + 1] + 10);
      data[i + 2] = Math.min(255, data[i + 2] + 10);
    }

    this.context.putImageData(imageData, 0, 0);
  }

  private adjustContrast(value: number, contrast: number): number {
    return Math.max(0, Math.min(255, (value - 128) * contrast + 128));
  }

  // Stop camera and release resources
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Get user-friendly error messages
  private getCameraErrorMessage(error: DOMException): string {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Camera access denied. Please enable camera permissions in your browser settings.';
      case 'NotFoundError':
        return 'No camera found on this device.';
      case 'NotSupportedError':
        return 'Camera not supported on this device.';
      case 'NotReadableError':
        return 'Camera is being used by another application.';
      case 'OverconstrainedError':
        return 'Camera constraints not supported.';
      default:
        return 'Camera access failed. Please try again.';
    }
  }

  // Check if camera is available
  static async isCameraAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      return false;
    }
  }

  // Get available cameras
  static async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      return [];
    }
  }
}

// Barcode Detection Manager
export class BarcodeDetectionManager {
  private detector: any = null;
  private isDetecting = false;
  private detectionCallback: ((result: any) => void) | null = null;
  private supportedFormats = [
    'qr_code',
    'code_128',
    'code_39',
    'code_93',
    'ean_13',
    'ean_8',
    'upc_a',
    'upc_e',
    'data_matrix',
    'pdf417'
  ];

  // Initialize barcode detector
  async initialize(): Promise<boolean> {
    try {
      if ('BarcodeDetector' in window) {
        this.detector = new (window as any).BarcodeDetector({
          formats: this.supportedFormats
        });
        return true;
      } else {
        console.warn('BarcodeDetector not supported, using fallback');
        return false;
      }
    } catch (error) {
      console.error('Barcode detector initialization failed:', error);
      return false;
    }
  }

  // Start barcode detection on video stream
  startDetection(videoElement: HTMLVideoElement, callback: (result: any) => void): boolean {
    if (!this.detector) {
      console.warn('Barcode detector not available');
      return false;
    }

    this.isDetecting = true;
    this.detectionCallback = callback;

    const detectBarcodes = async () => {
      if (!this.isDetecting || !videoElement) return;

      try {
        const barcodes = await this.detector.detect(videoElement);
        
        if (barcodes.length > 0) {
          const barcode = barcodes[0];
          const result = {
            value: barcode.rawValue,
            format: barcode.format,
            boundingBox: barcode.boundingBox,
            cornerPoints: barcode.cornerPoints,
            confidence: this.calculateConfidence(barcode)
          };

          if (this.detectionCallback) {
            this.detectionCallback(result);
          }
        }
      } catch (error) {
        console.error('Barcode detection error:', error);
      }

      // Continue detection
      if (this.isDetecting) {
        requestAnimationFrame(detectBarcodes);
      }
    };

    detectBarcodes();
    return true;
  }

  // Stop barcode detection
  stopDetection(): void {
    this.isDetecting = false;
    this.detectionCallback = null;
  }

  // Calculate confidence score for detected barcode
  private calculateConfidence(barcode: any): number {
    // Simple confidence calculation based on barcode properties
    let confidence = 80; // Base confidence

    // Increase confidence for well-known formats
    if (['qr_code', 'ean_13', 'code_128'].includes(barcode.format)) {
      confidence += 10;
    }

    // Increase confidence for longer values (more data)
    if (barcode.rawValue.length > 10) {
      confidence += 5;
    }

    // Ensure confidence is within bounds
    return Math.min(100, Math.max(0, confidence));
  }

  // Check if barcode detection is supported
  static isSupported(): boolean {
    return 'BarcodeDetector' in window;
  }
}

// Mobile-specific utilities
export class MobileUtils {
  // Detect if device is mobile
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Detect device orientation
  static getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // Optimize camera settings for mobile
  static getOptimalConstraints(): MediaStreamConstraints {
    const isMobile = this.isMobile();
    
    return {
      video: {
        facingMode: 'environment',
        width: { ideal: isMobile ? 1280 : 1920, min: 640 },
        height: { ideal: isMobile ? 720 : 1080, min: 480 },
        aspectRatio: { ideal: 16/9 }
      }
    };
  }

  // Handle device orientation changes
  static onOrientationChange(callback: (orientation: string) => void): () => void {
    const handleOrientationChange = () => {
      callback(this.getOrientation());
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Return cleanup function
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }
}

// Screen Capture Manager for Screenshots
export class ScreenCaptureManager {
  private stream: MediaStream | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  // Initialize screen capture
  async initializeScreenCapture(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen capture not supported on this browser');
      }

      const constraints: DisplayMediaStreamConstraints = {
        video: {
          cursor: 'always',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 60, max: 60 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      return true;

    } catch (error) {
      console.error('Screen capture initialization failed:', error);
      throw new Error(this.getScreenCaptureErrorMessage(error as DOMException));
    }
  }

  // Capture full screen screenshot
  async captureScreenshot(options: {
    quality?: number;
    format?: string;
    filename?: string;
  } = {}): Promise<{
    file: File;
    imageUrl: string;
    width: number;
    height: number;
  }> {
    try {
      await this.initializeScreenCapture();
      
      const {
        quality = 0.95,
        format = 'image/png',
        filename = `screenshot_${Date.now()}.png`
      } = options;

      // Create video element to capture stream
      const video = document.createElement('video');
      video.srcObject = this.stream;
      video.muted = true;
      
      // Wait for video to load
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(() => resolve()).catch(reject);
        };
        video.onerror = reject;
      });

      // Create canvas for capture
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      
      if (!this.context) {
        throw new Error('Unable to create canvas context');
      }

      // Set canvas dimensions to video dimensions
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;

      // Draw video frame to canvas
      this.context.drawImage(video, 0, 0);

      // Clean up stream
      this.stopScreenCapture();

      // Convert to blob
      return new Promise((resolve, reject) => {
        this.canvas!.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to capture screenshot'));
            return;
          }
          
          const file = new File([blob], filename, { type: format });
          const imageUrl = URL.createObjectURL(blob);
          
          resolve({
            file,
            imageUrl,
            width: this.canvas!.width,
            height: this.canvas!.height
          });
        }, format, quality);
      });

    } catch (error) {
      this.stopScreenCapture();
      throw error;
    }
  }

  // Capture specific element as screenshot
  async captureElement(element: HTMLElement, options: {
    quality?: number;
    format?: string;
    filename?: string;
  } = {}): Promise<{
    file: File;
    imageUrl: string;
    width: number;
    height: number;
  }> {
    const {
      quality = 0.95,
      format = 'image/png',
      filename = `element_screenshot_${Date.now()}.png`
    } = options;

    try {
      // Get element bounds
      const rect = element.getBoundingClientRect();
      
      // Create canvas with element dimensions
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Unable to create canvas context');
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Use html2canvas alternative - convert element to blob
      const clonedElement = element.cloneNode(true) as HTMLElement;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      
      svg.setAttribute('width', rect.width.toString());
      svg.setAttribute('height', rect.height.toString());
      foreignObject.setAttribute('width', '100%');
      foreignObject.setAttribute('height', '100%');
      foreignObject.appendChild(clonedElement);
      svg.appendChild(foreignObject);

      const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to capture element'));
              return;
            }
            
            const file = new File([blob], filename, { type: format });
            const imageUrl = URL.createObjectURL(blob);
            
            resolve({
              file,
              imageUrl,
              width: canvas.width,
              height: canvas.height
            });
          }, format, quality);
        };
        img.onerror = reject;
        img.src = url;
      });

    } catch (error) {
      throw new Error(`Element capture failed: ${error}`);
    }
  }

  // Stop screen capture and clean up resources
  stopScreenCapture(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Get user-friendly error messages for screen capture
  private getScreenCaptureErrorMessage(error: DOMException): string {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Screen capture permission denied. Please allow screen sharing to take screenshots.';
      case 'NotSupportedError':
        return 'Screen capture not supported on this browser or device.';
      case 'NotReadableError':
        return 'Screen capture failed. Please try again.';
      case 'AbortError':
        return 'Screen capture was cancelled.';
      default:
        return 'Screen capture failed. Please ensure you have the latest browser version.';
    }
  }

  // Check if screen capture is supported
  static isScreenCaptureSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }

  // Quick screenshot utility function
  static async takeQuickScreenshot(filename?: string): Promise<{
    file: File;
    imageUrl: string;
    width: number;
    height: number;
  }> {
    const manager = new ScreenCaptureManager();
    return await manager.captureScreenshot({ filename });
  }

  // Quick element capture utility function
  static async captureQuickElement(element: HTMLElement, filename?: string): Promise<{
    file: File;
    imageUrl: string;
    width: number;
    height: number;
  }> {
    const manager = new ScreenCaptureManager();
    return await manager.captureElement(element, { filename });
  }
}