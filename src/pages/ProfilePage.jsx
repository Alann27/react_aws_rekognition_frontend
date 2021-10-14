import { makeStyles } from "@mui/styles";
import {Box, Grid, Typography} from '@mui/material';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router";

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

export default function HomePage(){
    const user = useSelector((store) => store.user.user);
    const history = useHistory();

    const userIsLogged = useSelector(store => store.user.loginSuccess);
    
    useEffect(() => {
      if (!userIsLogged){
        history.push("/");
      }
    },[])
  

    const classes = styles();

    return (<>
        <div className={classes.container}>
        <Box>
        <Grid container>
            <Grid item xs={12}>
                <img src={user.imgUrl} className={classes.imgProfile} />
            </Grid>
            <Grid item xs={12} sx={{marginTop: 3}}>
                <Typography variant="subtitle1">{`Welcome to your profile, ${user?.name} ${user?.lastName}!`}</Typography>
            </Grid>
        </Grid>
        </Box>

        </div>
    </>);
}