import axios from 'axios';
import xml2js from 'xml2js';

const XML_URL = 'https://www.assets.gnmotors.co.nz/gnmotors-vehicles/gnmotorsr.xml';

const parser = new xml2js.Parser();

// Helper function to create URL-safe slugs
// Converts spaces to dashes and removes special characters
export function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/[^\w-]/g, '');         // Remove special characters except dashes
}

// In-memory cache for ISR (Incremental Static Regeneration)
// Caches parsed XML data to reduce external API calls
let vehiclesCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clears the vehicles cache
 * Called by the revalidate API endpoint when webhook is triggered
 * Allows immediate cache invalidation without waiting for TTL
 */
export function clearCache() {
  vehiclesCache = null;
  cacheTime = null;
  console.log('[ISR] Vehicles cache cleared');
}

export async function getVehicles() {
  try {
    // Return cached data if fresh (within 5 minutes)
    // This enables ISR by reducing API calls during the revalidate period
    if (vehiclesCache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      console.log('[ISR] Returning cached vehicles');
      return vehiclesCache;
    }

    console.log('[ISR] Fetching fresh vehicles from XML API');
    const response = await axios.get(XML_URL);
    const result = await parser.parseStringPromise(response.data);
    
    const vehicles = result.vehicles.vehicle.map((vehicle) => {
      const vehicleId = vehicle.id?.[0] || '';
      const manufacturer = vehicle.brand_name?.[0] || '';
      const model = vehicle.model_name?.[0] || '';
      
      // Generate image URLs based on manufacturer, model, and vehicle ID
      const manufacturerSlug = manufacturer.toLowerCase();
      const modelSlug = model.toLowerCase().replace(/\s+/g, '-');
      
      // Support multiple image formats: jpg, jpeg, png, webp
      // The image gallery will try each format and only show valid images
      const imageFormats = ['jpg', 'jpeg', 'png', 'webp'];
      
      // Generate array of 10 images with multiple format fallbacks
      const images = [];
      for (let i = 1; i <= 10; i++) {
        // Create variants for each image number with different formats
        // e.g., 1.jpg, 1.jpeg, 1.png, 1.webp
        const imagePath = `https://www.assets.gnmotors.co.nz/brands/${manufacturerSlug}/${modelSlug}/${vehicleId}/${i}`;
        images.push(`${imagePath}.jpg`); // Primary format
      }
      
      // Thumbnail is the first image
      const thumbnailImage = images[0];

      return {
        id: vehicleId,
        stockNo: vehicleId,
        manufacturer,
        model,
        year: vehicle.vehicle_year?.[0] || '',
        bodyStyle: vehicle.vehicle_body_style?.[0] || '',
        color: vehicle.vehicle_color?.[0] || '',
        transmission: vehicle.vehicle_transmission?.[0] || '',
        fuelType: vehicle.vehicle_fuel_type?.[0] || '',
        engineSize: vehicle.vehicle_engine_size?.[0] || '0',
        mileage: vehicle.vehicle_mileage?.[0] || '0',
        mileageUnit: 'km',
        price: vehicle.vehicle_special_price?.[0] || vehicle.vehicle_normal_price?.[0] || '',
        dealership: vehicle.vehicle_dealership?.[0] || '',
        status: vehicle.vehicle_status?.[0] || '',
        description: vehicle.vehicle_description?.[0] || '',
        interiorColor: vehicle.vehicle_interior_color?.[0] || '',
        seats: vehicle.vehicle_seats?.[0] || '',
        driveSystem: vehicle.vehicle_wheel_drive?.[0] || '',
        exteriorFeatures: vehicle.vehicle_exterior_features?.[0] || '',
        interiorFeatures: vehicle.vehicle_interior_features?.[0] || '',
        shortDesc: vehicle.vehicle_short_description?.[0] || '',
        variant: vehicle.vehicle_variant?.[0] || '',
        vin: vehicle.vehicle_vin?.[0] || '',
        regNo: vehicle.vehicle_registration_number?.[0] || '',
        purchaseDate: vehicle.vehicle_purchase_date?.[0] || '',
        turbo: vehicle.vehicle_turbo?.[0] || '',
        seatMaterial: vehicle.vehicle_seat_material?.[0] || '',
        airbags: vehicle.vehicle_airbags?.[0] || '',
        promotionTag: vehicle.vehicle_promotion_tag?.[0] || '',
        active: vehicle.vehicle_active?.[0] || 'true',
        thumbnailImage,
        images,
      };
    });

    vehiclesCache = vehicles;
    cacheTime = Date.now();

    return vehicles;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

export async function getVehicleById(id) {
  const vehicles = await getVehicles();
  return vehicles.find((v) => v.id === id);
}

export async function searchVehicles(query) {
  const vehicles = await getVehicles();
  const lowerQuery = query.toLowerCase();

  return vehicles.filter(
    (v) =>
      v.manufacturer.toLowerCase().includes(lowerQuery) ||
      v.model.toLowerCase().includes(lowerQuery) ||
      v.stockNo.toLowerCase().includes(lowerQuery)
  );
}
