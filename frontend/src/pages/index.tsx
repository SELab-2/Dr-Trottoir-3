import {Inter} from '@next/font/google';
import NavBar from '../components/elements/navbarElement/navbar';

// eslint-disable-next-line require-jsdoc
export default function Home() {
  return (
    <>
      <NavBar>
        <div style={{backgroundColor: 'white', width: '100%', height: '100%'}}/>
      </NavBar>
    </>
  );
}
