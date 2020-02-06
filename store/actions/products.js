import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';

export const deleteProduct = productId => {
  return async dispatch => {
    await fetch(`https://rn-shop-app-8fd49.firebaseio.com/products/${productId}.json`, {
      method: 'DELETE'
    });

    dispatch({
      type: DELETE_PRODUCT, pid: productId
    });
  }
};

export const fetchProduct = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        'https://rn-shop-app-8fd49.firebaseio.com/products.json'
      );

      if (!response.ok) {
        throw new Error('something wrong')
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            'u1',
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );

      }

      dispatch({type: SET_PRODUCT, products: loadedProducts});
    } catch (error) {
      throw error
    }
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`https://rn-shop-app-8fd49.firebaseio.com/products.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });

    const responseData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name,
        title,
        description,
        imageUrl,
        price
      }
    })
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    console.log(token)
    await fetch(`https://rn-shop-app-8fd49.firebaseio.com/products/${id}.json?auth=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl
      })
    });

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    })
  };
};
