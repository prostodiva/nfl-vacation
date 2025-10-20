import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/index";
import Root from "./root/Root";
import HomePage from "./pages/HomePage";
import { Provider } from "react-redux";
import SearchPage from "./pages/search/SearchPage";

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
      {
        path: "/search",
        element: <SearchPage />
      }
    ]
  }
]);


function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
