import axios from 'axios';

const fetchProductData = async (barcode: string) => {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    if (response.data.status === 1) {
      const product = response.data.product;
      console.log('Tuotenimi:', product.product_name);
      console.log('Ravintoarvot:', product.nutriments);
    } else {
      console.log('Tuotetta ei löytynyt.');
    }
  } catch (error) {
    console.error('Virhe haettaessa tietoja:', error);
  }
};

export default fetchProductData;