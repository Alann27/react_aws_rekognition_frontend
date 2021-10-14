import { WebcamCapture } from "../components/WebCam.jsx";
import { Alert, Button, Grid, Link, Snackbar, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Box, display } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { clearLoginState, loginUser } from "../redux/ducks/userDuck.js";

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

export default function LoginPage() {
  const {
    handleSubmit,
    clearErrors,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const history = useHistory();

  const loginSuccess = useSelector((store) => store.user.loginSuccess);
  const loginFail = useSelector((store) => store.user.loginFail);
  const user = useSelector((store) => store.user.user);

  useEffect(() => {
    if (loginSuccess){
      history.push('/LoginRekognition');
    }
  }, [loginSuccess])
  


  const onSubmit = async (data) => {
    await dispatch(loginUser(data.email, data.password));
  }

  function closeSnackbar(snackbar, reason) {
    if (reason === "clickaway") {
      return;
    }

    dispatch(clearLoginState());
  }


  const classes = styles();
  return (
    <>
      <div className={classes.container}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} >
        <Box width={250}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            rowSpacing={3}
          >
            <Grid item xs={12}>
              <AccountCircleIcon style={{ fontSize: 100 }} />
            </Grid>
            <Grid item xs={12} rowSpacing={0}>
              <Typography variant="h4"> Login </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                type="email"
                label="Email"
                size="small"
                fullWidth
                name="email"
                {...register("email", { required: true })}
                error={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Password"
                type="password"
                size="small"
                fullWidth
                name="password"
                {...register("password", { required: true })}
                error={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained"  type="submit" fullWidth>
                Login{" "}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                sx={{ fontSize: 9 }}
                onClick={() => history.push("/Register")}
              >
                Doesn't have an account? Register here!
              </Button>
            </Grid>
          </Grid>
        </Box>
        </form>
      </div>
      <Snackbar
        open={loginSuccess}
        autoHideDuration={3000}
        onClose={(event, reason) => closeSnackbar("success", reason)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Login successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={loginFail}
        autoHideDuration={3000}
        onClose={(event, reason) => closeSnackbar("fail", reason)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
        User not found
        </Alert>
      </Snackbar>
    </>
  );
}
