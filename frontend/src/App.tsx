import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./root/Root";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  { 
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ]
  }
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
