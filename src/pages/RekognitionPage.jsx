import { makeStyles } from "@mui/styles";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { clearRekognitionError, verifyFaces } from "../redux/ducks/userDuck.js";

const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: 500,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  centered_contaienr: {},
}));

export default function RekognitionPage() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.user);
  const imagesMatch = useSelector((store) => store.user.imagesMatches);
  const checkImagesRunning = useSelector(
    (store) => store.user.checkImagesRunning
  );
  const imagesNotMatched = useSelector((store) => store.user.imagesNotMatched);
  const userIsLogged = useSelector(store => store.user.loginSuccess);

  useEffect(() => {
    if (!userIsLogged){
      history.push("/");
    }
  },[]);

  useEffect(() => {
    if (imagesMatch) {
      history.push("/Profile");
    }
  }, [imagesMatch]);

  const errorMatchingImages = useSelector(
    (store) => store.user.errorMatchingImages
  );

  function closeSnackbar(snackbar, reason) {
    if (reason === "clickaway") {
      return;
    }

    dispatch(clearRekognitionError());
  }

  const onSubmit = async () => {
    if (imgSrc) {
      let imageBlob = base64toBlob(imgSrc);
      dispatch(verifyFaces(imgSrc, imageBlob));
    }
  };

  const classes = styles();

  return (
    <>
      <div className={classes.container}>
        <Box>
          <Typography variant="h4">Facial Recognition</Typography>
          <Typography variant="subtitle1">
            {`You need to take a photo from your webcam and submit it to verify
            that you are  ${user?.name} ${user?.lastName}`}
          </Typography>
        </Box>
        <Box>
          <Grid container>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Webcam
                    style={{ width: 300, height: 300 }}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={capture}>Capture photo</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <img
                    src={imgSrc}
                    style={{ width: 300, height: 300, objectFit: "contain" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={onSubmit}>Submit</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          style={checkImagesRunning ? { display: "flex" } : { display: "none" }}
        >
          <CircularProgress size={75} />
        </Box>
      </div>
      <Snackbar
        open={errorMatchingImages}
        autoHideDuration={3000}
        onClose={(event, reason) => closeSnackbar("fail", reason)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          There was an error trying to make your request..
        </Alert>
      </Snackbar>
      <Snackbar
        open={imagesNotMatched}
        autoHideDuration={3000}
        onClose={(event, reason) => closeSnackbar("fail", reason)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You don't match with the profile image of this user!
        </Alert>
      </Snackbar>
    </>
  );
}

function base64toBlob(base64Data, contentType) {
  base64Data = base64Data.replace("data:image/jpeg;base64,", "");
  contentType = contentType || "image/jpeg";
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
