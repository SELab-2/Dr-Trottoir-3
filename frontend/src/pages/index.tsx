import Head from 'next/head';
import {Inter} from '@next/font/google';
import styles from '@/styles/Home.module.css';
import NavBar from '../components/elements/navbarElement/navbar';

// eslint-disable-next-line new-cap
const inter = Inter({subsets: ['latin']});

// eslint-disable-next-line require-jsdoc
export default function Home() {
  return (
    <>
        <NavBar>
            <div style={{backgroundColor: 'red', width: '100%', height: '100%'}}/>
        </NavBar>
    </>
  );
}
