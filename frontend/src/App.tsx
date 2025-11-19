import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/index';
import Root from './root/Root';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import SearchPage from './pages/search/SearchPage';
import TripPage from './pages/TripPage';
import ShoppingPage from './pages/ShoppingPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import SortingSection from "./components/SortingSection.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/teams',
        element: <SortingSection/>,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/stadiums',
        element: <SortingSection />,
      },
      {
        path: '/trip',
        element: <TripPage />,
      },
      {
        path: '/shopping',
        element: <ShoppingPage />,
      },
      {
        path: '/algorithms',
        element: <AlgorithmsPage />,
      }
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
