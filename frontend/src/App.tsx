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
      {
        path: "/teams",
        element: <div>Teams Page</div>
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
