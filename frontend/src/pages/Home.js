import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiUrl from '../config/config';
import axios from 'axios';
import background from '../media/background.jpg';
import spoekle from '../media/spoekle.webp';
import { FaYoutube } from 'react-icons/fa';

function HomePage() {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/config`);
        setConfig(response.data[0]);
        console.log('Config:', response.data[0]);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          description="ClipSesh! is a site for Beat Saber players by Beat Saber players. On this site you will be able to view all submitted clips
              from the Cube Community highlights channel. You can rate them, leave comments and discuss with fellow players!"
        />
      </Helmet>

      <div className="flex min-h-screen justify-center items-center animate-fade z-10">
        <img src={background} className="absolute top-0 w-full h-full z-0 object-cover" />
        <div className="flex flex-col absolute top-0 bg-gradient-to-b from-neutral-900 from-5% to-bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full text-white z-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-7xl lg:text-9xl font-bold mb-4 text-center">Spoekle's Hub</h1>
            <h1 className="text-lg md:text-xl lg:text-2xl mb-4 text-center">Everything Spoekle...</h1>
          </div>
          <div className="flex items-end">
            <Link to="/posts">
              <button className="bg-cc-red text-white hover:bg-white hover:text-cc-red font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                Explore
              </button>
            </Link>
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col p-4 pt-8 bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center items-center relative z-10">
        <div className="container grid grid-cols-1 md:grid-cols-2 justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center m-4 p-4 bg-neutral-300 dark:bg-neutral-950 transition duration-200 rounded-lg aspect-video">
            <p className="text-2xl font-bold m-4 text-center">Who am I?</p>
            <p className="text-lg m-4 text-center">Hey there! I'm Spoekle, a Full-Stack Web Dev, amateur 3D modeler and Video Editor!</p>
            <div className="flex flex-col justify-between mt-8">
              <Link to="/about">
                <button className="bg-cc-red text-white hover:bg-white hover:text-cc-red font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                  More Info
                </button>
              </Link>
            </div>
          </div>
          <div className="w-auto m-4">
            <img src={spoekle} alt="Banner" className="rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
