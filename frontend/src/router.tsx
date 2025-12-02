import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Speedometer from './pages/Speedometer';
import Info from './pages/Info';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'speedometer',
        element: <Speedometer />,
      },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

