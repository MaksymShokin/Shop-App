export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
  return async dispatch => {
    console.log(email, password)
    try {
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJPN4yui_yUKJ6DcSVvdyF37gz4FX8kuA',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          })
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      const resData = await response.json();
      console.log(resData)

      dispatch({
        type: SIGNUP
      })
    } catch (error) {
      throw error
    }
  }
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJPN4yui_yUKJ6DcSVvdyF37gz4FX8kuA',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })

      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!')
    }

    const resData = await response.json();
    console.log(resData)

    dispatch({type: LOGIN})
  }
};