"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Loader2, FileImage, Type, Palette } from 'lucide-react';

const CarDealerImageEditor = () => {
  const [carImage, setCarImage] = useState(null);
  const [removedBgImage, setRemovedBgImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [finalImage, setFinalImage] = useState(null);
  
  // Vehicle details
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  });

  // Background settings
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [useBackgroundImage, setUseBackgroundImage] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  // Car positioning and transformation
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 }); // Offset from center
  const [carRotation, setCarRotation] = useState(0); // Rotation in degrees
  const [carScale, setCarScale] = useState(70); // Scale percentage

  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  // Handle car image upload
  const handleCarImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCarImage(event.target.result);
        setRemovedBgImage(null);
        setFinalImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
        setUseBackgroundImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw live preview with current adjustments
  const drawLivePreview = () => {
    if (!removedBgImage || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (useBackgroundImage && backgroundImage) {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        drawCarWithAdjustments(ctx, canvas);
      };
      bgImg.src = backgroundImage;
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCarWithAdjustments(ctx, canvas);
    }
  };

  const drawCarWithAdjustments = (ctx, canvas) => {
    const carImg = new Image();
    carImg.crossOrigin = 'anonymous';
    carImg.onload = () => {
      // Calculate scaling to fit car in canvas
      const maxWidth = canvas.width * (carScale / 100);
      const maxHeight = canvas.height * (carScale / 100);
      let scale = Math.min(maxWidth / carImg.width, maxHeight / carImg.height);
      
      const carWidth = carImg.width * scale;
      const carHeight = carImg.height * scale;
      
      // Apply position offset
      const carX = (canvas.width - carWidth) / 2 + carPosition.x;
      const carY = (canvas.height - carHeight) / 2 + carPosition.y;

      // Save context state
      ctx.save();
      
      // Move to car center for rotation
      ctx.translate(carX + carWidth / 2, carY + carHeight / 2);
      
      // Apply rotation
      ctx.rotate((carRotation * Math.PI) / 180);
      
      // Draw car (offset by half dimensions since we're at center)
      ctx.drawImage(carImg, -carWidth / 2, -carHeight / 2, carWidth, carHeight);
      
      // Restore context state
      ctx.restore();
    };
    carImg.src = removedBgImage;
  };

  // Update preview whenever adjustments change
  useEffect(() => {
    drawLivePreview();
  }, [carScale, carRotation, carPosition, removedBgImage, backgroundColor, backgroundImage, useBackgroundImage]);

  // Remove background using @imgly/background-removal
  const removeBackground = async () => {
    if (!carImage) return;

    setIsProcessing(true);
    setProcessingStep('Removing background...');

    try {
      // Dynamically import the library
      const { removeBackground: removeBg } = await import('@imgly/background-removal');
      
      // Create image blob from data URL
      const response = await fetch(carImage);
      const blob = await response.blob();

      // Remove background
      const result = await removeBg(blob);
      
      // Convert result to data URL
      const url = URL.createObjectURL(result);
      setRemovedBgImage(url);
      setProcessingStep('Background removed!');
    } catch (error) {
      console.error('Error removing background:', error);
      setProcessingStep('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Compose final image with background and text
  const composeFinalImage = () => {
    if (!removedBgImage) return;

    setIsProcessing(true);
    setProcessingStep('Composing final image...');

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;

    // Function to draw everything after background is ready
    const drawContent = () => {
      // Add gradient overlay for depth (only if using solid color)
      if (!useBackgroundImage) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Load and draw car image
      const carImg = new Image();
      carImg.crossOrigin = 'anonymous';
      carImg.onload = () => {
        // Calculate scaling to fit car in canvas
        const maxWidth = canvas.width * (carScale / 100);
        const maxHeight = canvas.height * (carScale / 100);
        let scale = Math.min(maxWidth / carImg.width, maxHeight / carImg.height);
        
        const carWidth = carImg.width * scale;
        const carHeight = carImg.height * scale;
        
        // Apply position offset
        const carX = (canvas.width - carWidth) / 2 + carPosition.x;
        const carY = (canvas.height - carHeight) / 2 + carPosition.y;

        // Save context state
        ctx.save();
        
        // Move to car center for rotation
        ctx.translate(carX + carWidth / 2, carY + carHeight / 2);
        
        // Apply rotation
        ctx.rotate((carRotation * Math.PI) / 180);
        
        // Draw car (offset by half dimensions since we're at center)
        ctx.drawImage(carImg, -carWidth / 2, -carHeight / 2, carWidth, carHeight);
        
        // Restore context state
        ctx.restore();

        // Draw logo if available
        if (logoImage) {
          const logoImg = new Image();
          logoImg.onload = () => {
            const logoSize = 80;
            ctx.drawImage(logoImg, 30, 30, logoSize, logoSize);
            drawTextOverlays(ctx);
          };
          logoImg.src = logoImage;
        } else {
          drawTextOverlays(ctx);
        }
      };
      carImg.src = removedBgImage;
    };

    // Draw background
    if (useBackgroundImage && backgroundImage) {
      // Use background image
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        drawContent();
      };
      bgImg.src = backgroundImage;
    } else {
      // Use solid background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawContent();
    }
  };

  const drawTextOverlays = (ctx) => {
    // Draw vehicle details
    const { make, model, year, price } = vehicleDetails;
    
    if (make || model || year) {
      // Vehicle name background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, canvasRef.current.height - 120, canvasRef.current.width, 120);

      // Vehicle name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'left';
      const vehicleName = `${year} ${make} ${model}`.trim();
      ctx.fillText(vehicleName, 40, canvasRef.current.height - 60);

      // Price
      if (price) {
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'right';
        ctx.fillText(price, canvasRef.current.width - 40, canvasRef.current.height - 60);
      }
    }

    // Convert canvas to data URL
    const finalDataUrl = canvasRef.current.toDataURL('image/png');
    setFinalImage(finalDataUrl);
    setIsProcessing(false);
    setProcessingStep('Image ready!');
  };

  // Download final image
  const downloadImage = () => {
    if (!finalImage) return;

    const link = document.createElement('a');
    link.download = `${vehicleDetails.make}-${vehicleDetails.model}-banner.png`;
    link.href = finalImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Car Dealership Image Editor</h1>
          <p className="text-gray-400">Free background removal & banner creation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Left Panel - Upload & Settings */}
          <div className="space-y-6">
            {/* Upload Car Image */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Car Image
              </h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCarImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FileImage className="w-5 h-5" />
                Choose Car Image
              </button>
              {carImage && (
                <div className="mt-4">
                  <img src={carImage} alt="Uploaded car" className="w-full rounded-lg" />
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Vehicle Details
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Make (e.g., Toyota)"
                  value={vehicleDetails.make}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, make: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Model (e.g., Camry)"
                  value={vehicleDetails.model}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, model: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Year (e.g., 2024)"
                  value={vehicleDetails.year}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, year: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Price (e.g., $25,000)"
                  value={vehicleDetails.price}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, price: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Background Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Background & Branding
              </h2>
              <div className="space-y-4">
                {/* Toggle between color and image */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseBackgroundImage(false)}
                    className={`flex-1 py-2 rounded-lg transition ${
                      !useBackgroundImage 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Solid Color
                  </button>
                  <button
                    onClick={() => setUseBackgroundImage(true)}
                    className={`flex-1 py-2 rounded-lg transition ${
                      useBackgroundImage 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Custom Image
                  </button>
                </div>

{!useBackgroundImage ? (
                  <div key="color-input">
                    <label className="block text-sm text-gray-400 mb-2">Background Color</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                ) : (
                  <div key="image-input">
                    <label className="block text-sm text-gray-400 mb-2">Background Image</label>
                    <input
                      type="file"
                      ref={backgroundInputRef}
                      onChange={handleBackgroundImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => backgroundInputRef.current?.click()}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                    >
                      {backgroundImage ? 'Change Background Image' : 'Upload Background Image'}
                    </button>
                    {backgroundImage && (
                      <div className="mt-2">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-24 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dealership Logo (Optional)</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                  >
                    {logoImage ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={removeBackground}
                disabled={!carImage || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isProcessing && processingStep.includes('Removing') ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Removing Background...
                  </>
                ) : (
                  'Step 1: Remove Background'
                )}
              </button>

              {/* Step 2: Image Adjustments */}
              {removedBgImage && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Step 2: Adjust Image</h3>
                  
                  {/* Scale Control */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Scale: {carScale}%</label>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={carScale}
                      onChange={(e) => setCarScale(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Rotation Control */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Rotate: {carRotation}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={carRotation}
                      onChange={(e) => setCarRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Position Controls */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Move Horizontal: {carPosition.x}px</label>
                    <input
                      type="range"
                      min="-300"
                      max="300"
                      value={carPosition.x}
                      onChange={(e) => setCarPosition({...carPosition, x: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Move Vertical: {carPosition.y}px</label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={carPosition.y}
                      onChange={(e) => setCarPosition({...carPosition, y: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={composeFinalImage}
                disabled={!removedBgImage || isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition"
              >
                {isProcessing && processingStep.includes('Composing') ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Composing Image...
                  </>
                ) : (
                  'Step 3: Compose Banner'
                )}
              </button>

              <button
                onClick={downloadImage}
                disabled={!finalImage}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Banner
              </button>
            </div>

            {processingStep && (
              <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-300">
                {processingStep}
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6 lg:fixed lg:right-8 lg:top-32 lg:w-[calc(50%-4rem)]">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-32">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                {finalImage ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-2 p-2 text-center">Final Output</div>
                    <img src={finalImage} alt="Final banner" className="w-full rounded-lg" />
                  </div>
                ) : removedBgImage ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-2 p-2 text-center">Live Preview - Adjustments</div>
                    <canvas
                      ref={previewCanvasRef}
                      width={1200}
                      height={630}
                      className="w-full rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Upload an image to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden canvas for image composition */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDealerImageEditor;