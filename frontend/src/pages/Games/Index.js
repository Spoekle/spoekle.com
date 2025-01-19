import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoadingBar from 'react-top-loading-bar';
import background from '../../media/spoekle.webp';
import GameNavbar from './components/GameNavbar/GameNavbar';
import { Link } from 'react-router-dom';

function Games() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(100);
    }
        , []);

    return (
        <div className="min-h-screen text-white flex flex-col items-center bg-neutral-200 dark:bg-neutral-900 transition duration-200">
            <Helmet>
                <title>About Me</title>
                <meta name="description" description="" />
            </Helmet>
            <div className='w-full'>
                <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
            </div>
            <GameNavbar />
            <div className="w-full flex h-96 justify-center items-center animate-fade" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }}>
                <div className="flex bg-gradient-to-b from-neutral-900 to-bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-4xl font-bold mb-4 text-center">Games</h1>
                        <h1 className="text-3xl mb-4 text-center">Oooh gamingg :D</h1>
                    </div>
                </div>
            </div>

            <div className="container pt-20 mb-4 text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center justify-items-center animate-fade">
                <div className="grid mt-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">

                    <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                        <h2 className="text-3xl font-bold mb-4">Games</h2>
                        <p className='text-lg'>I love playing games, and I have a few games that I play regularly. I play games on my PC and Nintendo Switch. I also have a few games on my phone that I play when I'm on the go. I love playing games with my friends, and I'm always looking for new games to play.</p>
                        <h2 className="text-3xl font-bold mb-4 mt-8">Favorite Games</h2>
                        <div className="flex flex-wrap">
                            <div className="flex flex-col bg-neutral-400 dark:bg-neutral-700 p-4 rounded-md shadow-md m-2">
                                <h3 className="text-xl font-bold">PC</h3>
                                <p>Minecraft, Beat Saber, Roblox and the regular horror stuff</p>

                                <h3 className="text-xl font-bold mt-4">Nintendo Switch</h3>
                                <p>Mario Kart 8, Super Smash Bros</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                        <h2 className="text-3xl font-bold mb-4">Beat Saber</h2>
                        <p className='text-lg'>Beat Saber is a VR rhythm game where you slash the beats of adrenaline-pumping music as they fly towards you, surrounded by a futuristic world. I also create custom maps for this game. Check out more info by going to the Beat Saber page!</p>
                        <Link to='/games/beatsaber' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Beat Saber</Link>
                    </div>

                    <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                        <h2 className="text-3xl font-bold mb-4">Minecraft</h2>
                        <p className='text-lg'>Most people know Minecraft very well, blocks, crafting, mining, etc. While others do that, I host server to play on, mostly with friends or family. If you want to request a server or want more info, be sure to check out the Minecraft page!</p>
                        <Link to='/games/minecraft' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Minecraft</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Games;
