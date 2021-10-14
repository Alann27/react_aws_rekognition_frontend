import { makeStyles } from "@mui/styles";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearRegisterState } from "../redux/ducks/userDuck.js";

const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: 500,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  imgProfile: {
    marginBottom: 5,
    objectFit: "contain",
    width: 290,
    height: 245,
    textAlign: "end",
  },
  centered_contaienr: {},
}));

export default function RegisterPage() {
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const history = useHistory();

  const [img, setImg] = useState({});

  const [imgSrc, setImgSrc] = useState();
  const [imgName, setImgName] = useState("");

  const dispatch = useDispatch();

  const userRegistered = useSelector(store => store.user.userRegistered)
  const registerRunning = useSelector((store) => store.user.registerRunning);
  const imageDoesntHaveAPerson = useSelector((store) => store.user.errorImageDoesntHaveAPerson)
  const errorRegistering = useSelector((store) => store.user.errorRegistering);
  const errorRegisterMessage = useSelector(store => store.user.errorRegisterMessage);

  useEffect(() => {
    if (userRegistered){
      alert("user registered");
      history.push('/');
      dispatch(clearRegisterState());
    }
  }, [userRegistered])

  const onSubmit = (data) => {
    data.image = img;

    if (data.password !== data.confirmPassword) {
      alert(`passwords don't match`);
    } else {
      dispatch(registerUser(data));
    }
  };

  function onFileSelectedChange(event) {
    const { files, value } = event.target;
    if (files.length > 0) {
      const selectedFile = files[0];
      setImg(selectedFile);
      setImgSrc(URL.createObjectURL(selectedFile));

      if (selectedFile.name.length >= 32) {
        setImgName(selectedFile.name.substring(0, 30) + "...");
      } else {
        setImgName(selectedFile.name);
      }

      if (errors.image) {
        errors.image = undefined;
      }
    }
  }

  function closeSnackbar(snackbar, reason) {
    if (reason === "clickaway") {
      return;
    }

    dispatch(clearRegisterState());
  }

  const classes = styles();

  return (
    <>
      <div className={classes.container}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography variant="h4" sx={{ marginY: 5 }}>
              Register
            </Typography>
          </Box>
          <Box width={600}>
            <Grid container flexDirection="row" alignItems="center">
              <Grid item xs={6}>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      name="name"
                      required
                      size="small"
                      label="Name"
                      {...register("name", {
                        required: true,
                      })}
                      error={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="lastName"
                      required
                      size="small"
                      label="Last Name"
                      {...register("lastName", {
                        required: true,
                      })}
                      error={errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      required
                      size="small"
                      label="Email"
                      {...register("email", {
                        required: true,
                      })}
                      error={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      required
                      size="small"
                      label="Password"
                      type="password"
                      {...register("password", {
                        required: true,
                      })}
                      error={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="confirmPassword"
                      required
                      size="small"
                      label="Confirm password"
                      type="password"
                      {...register("confirmPassword", {
                        required: true,
                      })}
                      error={errors.confirmPassword}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <img
                      src={imgSrc}
                      className={classes.imgProfile}
                      style={{}}
                      alt={imgName}
                    />
                  </Grid>
                  {errors.image && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "error.main" }}
                      >
                        Image required!
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button variant="contained" component="label">
                      Upload image
                      <input
                        type="file"
                        name="image"
                        style={{ display: "none" }}
                        accept=".jpg,.jpeg,.png"
                        {...register("image", {
                          required: true,
                        })}
                        onChange={onFileSelectedChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Button variant="contained" sx={{ marginTop: 4 }} type="submit">
              Register
            </Button>
          </Box>
          <Box>
            <Button
              sx={{ marginTop: 2, fontSize: 9 }}
              onClick={() => {
                history.push("/LoginForm");
              }}
            >
              Back to login
            </Button>
          </Box>
        </form>
        <Box
          style={registerRunning ? { display: "flex" } : { display: "none" }}
        >
          <CircularProgress size={75} />
        </Box>
      </div>
      <Snackbar
        open={imageDoesntHaveAPerson || errorRegistering}
        autoHideDuration={3000}
        onClose={(event, reason) => closeSnackbar("fail", reason)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorRegisterMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
