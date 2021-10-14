import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RekognitionPage from "./pages/RekognitionPage.jsx";
import HomePage from "./pages/ProfilePage.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/LoginForm" exact>
          <LoginPage />
        </Route>
        <Route path="/Register" exact>
          <RegisterPage />
        </Route>
        <Route path="/LoginRekognition" exact>
          <RekognitionPage />
        </Route>
        <Route path="/Profile" exact>
          <HomePage>
          </HomePage>
        </Route>
        <Route path="/" exact>
          <Redirect to="/LoginForm" />
        </Route>
        <Route path="*">
          <h1>Not Found</h1>
        </Route>
      </Switch>
    </Router>
  );
}
