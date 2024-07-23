import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import HomePage from './pages/Home/HomePage';
import ErrorPage from './pages/Error/ErrorPage';
import AboutReactPage from './pages/AboutReact/AboutReactPage';

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <ErrorPage />
	},
	{
		path: "/about-react",
		element: <AboutReactPage />,
		errorElement: <ErrorPage />
	},
]);

function App() {
	return (
		<RouterProvider router={router} />
	);
}

export default App;
