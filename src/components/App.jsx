import { Provider } from "react-redux";
import AppRouter from "../AppRouter";
import generateStore from "../redux/store.js";

export default function App() {
  const store = generateStore();
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
