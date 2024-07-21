import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import AboutReact from './pages/AboutReact';

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <ErrorPage />
	},
	{
		path: "/about-react",
		element: <AboutReact />,
		errorElement: <ErrorPage />
	},
]);

function App() {
	return (
		<RouterProvider router={router} />
	);
}

export default App;
