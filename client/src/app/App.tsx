import AppRouter from "./router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
}

export default App;
