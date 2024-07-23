import { Link } from "react-router-dom";

import catPicture from 'assets/images/cat.jpg';
import './HomePage.css';

function HomePage() {
	var aboutReactLink = <Link to={"/about-react"}>React</Link>;
	return (
		<div className='home-page'>
			<h1>503 Error!</h1>
			<p>Site is under construction using {aboutReactLink}. Please come back at a later date.</p>
			<div>
				<p>In the meantime, here is a picture of a cat.</p>
				<img id='cat-picture' src={catPicture} alt="Random Cat" />
			</div>
		</div>
	);
}

export default HomePage;
