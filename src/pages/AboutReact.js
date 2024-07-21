import logo from '../assets/images/react-logo.svg';
import './AboutReact.css';

function AboutReact() {
  return (
    <div className="AboutReact">
      <header className="AboutReact-header">
        <img src={logo} className="React-logo" alt="logo" />
        <p>
          This App is made with React!
        </p>
        <a
          className="React-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default AboutReact;
