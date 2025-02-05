import { ApiResponse } from '@/types/interfaces';

async function fetchProduct(barcode: string): Promise<ApiResponse> {
  const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  return response.json();
}

async function handleProductFetch(barcode: string) {
  try {
    const data = await fetchProduct(barcode); // Fetch product details based on barcode

    if (data.status === 1 && data.product) {
      console.log("Product succesfully fetched from API");
      return data; // Return the valid data
    } else {
      console.error("Product not found or invalid response.");
      return null; // Return null in case of missing data
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Handle the error and return null
  }
}

export default handleProductFetch;