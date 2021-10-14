import axios from "axios";

//constants
const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
const REGISTER_USER_FAIL = "REGISTER_USER_FAIL";
const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
const LOGIN_USER_FAIL = "LOGIN_USER_FAIL";
const CHECK_IMAGE_SUCCESS = "CHECK_IMAGE_SUCCESS";
const CHECK_IMAGE_FAIL = "CHECK_IMAGE_FAIL";
const CLEAR_LOGIN_STATE = "CLEAR_LOGIN_STATE";
const CHECK_IMAGE_BEGIN = "CHECK_IMAGE_BEGIN";
const CLEAR_IMAGES_MATCHING_ERROR = "CLEAR_IMAGES_MATCHING_ERROR";
const ERROR_IMAGE_DOESNT_HAVE_A_PERSON = "ERROR_IMAGE_DOESNT_HAVE_A_PERSON";
const USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS";
const USER_REGISTER_FAIL = "USER_REGISTER_FAIL";
const CLEAR_REGISTER_STATE = "CLEAR_REGISTER_STATE";
const REGISTER_BEGIN = "REGISTER_BEGIN";

const initialData = {
  user: {},
  loginSuccess: false,
  loginFail: false,
  registerSuccess: false,
  registerFail: false,
  errorMatchingImages: false,
  imagesMatches: false,
  checkImagesRunning: false,
  imagesNotMatched: false,
  errorRegistering: false,
  userRegistered: false,
  errorImageDoesntHaveAPerson: false,
  errorRegisterMessage: undefined,
  registerRunning: false,
};

//reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case REGISTER_USER_SUCCESS: {
    }
    case LOGIN_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload.user,
        loginSuccess: action.payload.loginSuccess,
      };
    }
    case LOGIN_USER_FAIL: {
      return {
        ...state,
        user: action.payload.user,
        loginFail: action.payload.loginFail,
      };
    }
    case REGISTER_USER_SUCCESS: {
    }
    case REGISTER_USER_FAIL: {
    }
    case CLEAR_LOGIN_STATE: {
      const { loginSuccess, loginFail } = action.payload;
      return {
        ...state,
        loginFail,
        loginSuccess,
      };
    }
    case CHECK_IMAGE_SUCCESS: {
      const { checkImagesRunning, imagesMatches, imagesNotMatched } =
        action.payload;
      return { ...state, checkImagesRunning, imagesMatches, imagesNotMatched };
    }
    case CHECK_IMAGE_BEGIN: {
      const { checkImagesRunning } = action.payload;
      return { ...state, checkImagesRunning };
    }
    case CHECK_IMAGE_FAIL: {
      const { checkImagesRunning, errorMatchingImages } = action.payload;
      return { ...state, checkImagesRunning, errorMatchingImages };
    }
    case CLEAR_IMAGES_MATCHING_ERROR: {
      const { errorMatchingImages, imagesNotMatched } = action.payload;
      return { ...state, errorMatchingImages, imagesNotMatched };
    }
    case USER_REGISTER_SUCCESS: {
      const { userRegistered, registerRunning } = action.payload;
      return { ...state, userRegistered, registerRunning };
    }
    case USER_REGISTER_FAIL: {
      const { errorRegistering, errorRegisterMessage, registerRunning } = action.payload;
      return { ...state, errorRegistering, errorRegisterMessage, registerRunning };
    }
    case ERROR_IMAGE_DOESNT_HAVE_A_PERSON: {
      const {
        errorImageDoesntHaveAPerson,
        registerRunning,
        errorRegisterMessage,
      } = action.payload;
      return { ...state, errorImageDoesntHaveAPerson, registerRunning, errorRegisterMessage };
    }
    case CLEAR_REGISTER_STATE: {
      const {
        errorImageDoesntHaveAPerson,
        errorRegistering,
        errorRegisterMessage,
        registerRunning,
        userRegistered,
      } = action.payload;
      return {
        ...state,
        errorImageDoesntHaveAPerson,
        errorRegistering,
        registerRunning,
        errorRegisterMessage,
        userRegistered,
      };
    }
    case REGISTER_BEGIN: {
      const { registerRunning } = action.payload;
      return { ...state, registerRunning };
    }
    default: {
      return state;
    }
  }
}

//actions
export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8080/User/Login", {
      email,
      password,
    });

    if (response?.data?.data?.user) {
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user: response.data.data.user,
          loginSuccess: true,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAIL,
      payload: {
        user: {},
        loginFail: true,
      },
    });
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_BEGIN,
      payload: {
        registerRunning: true,
      },
    });
    const { email, lastName, name, password, image } = data;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);

    const response = await axios.post(
      "http://localhost:8080/User/Register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response?.data?.success === false) {
      dispatch({
        type: ERROR_IMAGE_DOESNT_HAVE_A_PERSON,
        payload: {
          errorImageDoesntHaveAPerson: true,
          registerRunning: false,
          errorRegisterMessage: `The image provided doesn't have a person`,
        },
      });
    } else if (response?.data?.success === true && response?.data?.data?.user) {
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: {
          userRegistered: true,
          registerRunning: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
    const messageError = error.response.status === 400 && error.response?.data?.success === false ? 'Email already in use' : "There was an error trying to make your request";
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: {
        errorRegistering: true,
        registerRunning: false,
        errorRegisterMessage: messageError,
      },
    });
  }
};

export const clearRegisterState = () => (dispatch) => {
  dispatch({
    type: CLEAR_REGISTER_STATE,
    payload: {
      errorRegistering: false,
      userRegistered: false,
      errorImageDoesntHaveAPerson: false,
      errorRegisterMessage: undefined,
    },
  });
};

export const verifyFaces =
  (image, imageArray) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CHECK_IMAGE_BEGIN,
        payload: {
          checkImagesRunning: true,
        },
      });

      const user = getState().user.user;
      image = image.replace("data:image/jpeg;base64,", "");

      const formData = new FormData();
      formData.append("image", imageArray, "webcam-image.jpeg");
      formData.append("imgUrl", user.imgUrl);
      formData.append("imageBase64", image);

      const response = await axios.post(
        "http://localhost:8080/User/VerifyFaces",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.data?.matches) {
        dispatch({
          type: CHECK_IMAGE_SUCCESS,
          payload: {
            imagesMatches: response.data.data.matches,
            imagesNotMatched: false,
            checkImagesRunning: false,
          },
        });
      } else {
        dispatch({
          type: CHECK_IMAGE_SUCCESS,
          payload: {
            imagesMatches: false,
            imagesNotMatched: true,
            checkImagesRunning: false,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: CHECK_IMAGE_FAIL,
        payload: {
          errorMatchingImages: true,
          checkImagesRunning: false,
        },
      });
    }
  };

export const clearRekognitionError = () => (dispatch) => {
  dispatch({
    type: CLEAR_IMAGES_MATCHING_ERROR,
    payload: {
      errorMatchingImages: false,
      imagesNotMatched: false,
    },
  });
};

export const clearLoginState = () => (dispatch) => {
  dispatch({
    type: CLEAR_LOGIN_STATE,
    payload: {
      loginFail: false,
      loginSuccess: false,
    },
  });
};
