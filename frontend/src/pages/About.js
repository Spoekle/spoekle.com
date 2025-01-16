import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiUrl from '../config/config';
import axios from 'axios';
import { BiLoaderCircle } from 'react-icons/bi';
import LoadingBar from 'react-top-loading-bar';
import background from '../media/spoekle.webp';
import { Link } from 'react-router-dom';

function About() {
    const [config, setConfig] = useState({ denyThreshold: 0, latestVideoLink: '' });
    const [clips, setClips] = useState([]);
    const [ratings, setRatings] = useState({});
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [seasonInfo, setSeasonInfo] = useState({});
    const [zips, setZips] = useState([]);
    const [zipsLoading, setZipsLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
        fetchZips();
    }, []);

    const fetchInitialData = async () => {
        try {
            setProgress(10);
            await fetchConfig();
            setProgress(30);
            getSeason();
            setProgress(50);
            await fetchClipsAndRatings();
            setProgress(100);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/admin/config`);

            if (response) {
                setConfig(response.data[0]);
                console.log('Config fetched successfully:', response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const fetchClipsAndRatings = async () => {
        try {
            const clipResponse = await axios.get(`${apiUrl}/api/clips`);
            setClips(clipResponse.data);
            setSeasonInfo(prevSeasonInfo => ({
                ...prevSeasonInfo,
                clipAmount: clipResponse.data.length
            }));
            const token = localStorage.getItem('token');
            if (token) {
                const ratingPromises = clipResponse.data.map(clip =>
                    axios.get(`${apiUrl}/api/ratings/${clip._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );
                const ratingResponses = await Promise.all(ratingPromises);
                const ratingsData = ratingResponses.reduce((acc, res, index) => {
                    acc[clipResponse.data[index]._id] = res.data;
                    setProgress(90);
                    return acc;
                }, {});
                setRatings(ratingsData);
            }
        } catch (error) {
            console.error('Error fetching clips and ratings:', error);
        }
    };

    const fetchZips = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/zips`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setZips(response.data);
            setZipsLoading(false);
        } catch (error) {
            console.error('Error fetching zips:', error);
            setZipsLoading(false);
        }
    };

    const deniedClips = clips.filter(clip => {
        const ratingData = ratings[clip._id];
        return ratingData && ratingData.ratingCounts.some(rateData => rateData.rating === 'deny' && rateData.count >= config.denyThreshold);
    }).length;

    const processClips = async () => {
        if (!window.confirm("Are you sure you want to process these clips?")) {
            return;
        }

        setDownloading(true);
        setDownloadProgress(0);

        const filteredClips = clips.filter((clip) => {
            const ratingData = ratings[clip._id];
            return (
                ratingData &&
                ratingData.ratingCounts.every(
                    (rateData) => rateData.rating !== 'deny' || rateData.count < config.denyThreshold
                )
            );
        });

        try {
            const response = await axios.post(
                `${apiUrl}/api/zips/process`,
                {
                    clips: filteredClips.map((clip) => {
                        const ratingData = ratings[clip._id];
                        const mostChosenRating = ratingData.ratingCounts.reduce(
                            (max, rateData) => (rateData.count > max.count ? rateData : max),
                            ratingData.ratingCounts[0]
                        );
                        return { ...clip, rating: mostChosenRating.rating };
                    }),
                    season: seasonInfo.season,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to process clips');
            }

            alert('Zipped clips stored in DB successfully!');
            fetchZips();
        } catch (error) {
            console.error('Error processing clips:', error);
        } finally {
            setDownloading(false);
            setDownloadProgress(0);
        }
    };

    const getSeason = () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        let season = '';

        if (
            (month === 3 && day >= 20) ||
            (month > 3 && month < 6) ||
            (month === 6 && day <= 20)
        ) {
            season = 'Spring';
        } else if (
            (month === 6 && day >= 21) ||
            (month > 6 && month < 9) ||
            (month === 9 && day <= 20)
        ) {
            season = 'Summer';
        } else if (
            (month === 9 && day >= 21) ||
            (month > 9 && month < 12) ||
            (month === 12 && day <= 20)
        ) {
            season = 'Fall';
        } else {
            season = 'Winter';
        }

        setSeasonInfo(prevSeasonInfo => ({
            ...prevSeasonInfo,
            season
        }));
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center bg-neutral-200 dark:bg-neutral-900 transition duration-200">
            <Helmet>
                <title>About Me</title>
                <meta name="description" description="" />
            </Helmet>
            <div className='w-full'>
                <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
            </div>
            <div className="w-full flex h-96 justify-center items-center animate-fade" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }}>
                <div className="flex bg-gradient-to-b from-neutral-900 to-bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-4xl font-bold mb-4 text-center">About me</h1>
                        <h1 className="text-3xl mb-4 text-center">What is a Spoekle????</h1>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="container pt-20 mb-4 text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-900 flex flex-col items-center justify-center animate-fade">
                    <h1 className="text-5xl font-bold mb-8 text-center">Loading...</h1>
                    <BiLoaderCircle className="animate-spin text-7xl" />
                </div>
            ) : (

                <div className="container pt-20 mb-4 text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center justify-items-center animate-fade">

                    <div className="grid mt-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">

                        <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                            <h2 className="text-3xl font-bold mb-4">About Me</h2>
                            <p className="text-lg">I am a software engineer with a passion for creating and building things. I have experience in full-stack development, server hosting and networking. I am always looking for new opportunities to learn and grow as a developer.</p>
                            <h2 className="text-3xl font-bold mb-4 mt-8">Skills</h2>
                            <div className="flex flex-wrap">
                                <div className="flex flex-col bg-neutral-400 dark:bg-neutral-700 p-4 rounded-md shadow-md m-2">
                                    <h3 className="text-xl font-bold">Frontend</h3>
                                    <p>React (JavaScript), Laravel (PHP), TailwindCSS</p>

                                    <h3 className="text-xl font-bold mt-4">Backend</h3>
                                    <p>Node.js, Express.js, Mongo</p>

                                    <h3 className="text-xl font-bold mt-4">DevOps</h3>
                                    <p>Docker, Git</p>

                                    <h3 className="text-xl font-bold mt-4">Networking</h3>
                                    <p>Firewall, VPN</p>

                                    <h3 className="text-xl font-bold mt-4">Other</h3>
                                    <p>Python, C# Java</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                            <h2 className="text-3xl font-bold mb-4">Education</h2>
                            <p className="text-lg">I'm still enrolled in education, which is at MBO Utrecht, afterwards, I will persue my goal of getting my Bachelor Computer Science degree at Hogeschool Utrecht. 
                                I have also completed several online courses in web development and software engineering.</p>
                        </div>

                        <div className="flex flex-col bg-neutral-300 dark:bg-neutral-800 p-4 rounded-md shadow-md">
                            <h2 className="text-3xl font-bold mb-4">Projects</h2>
                            <p className="text-lg">I have worked on a variety of projects ranging from small websites to large scale applications. I have experience working with clients to deliver projects on time and on budget. Check them out below!</p>
                            <Link
                                to="/projects"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                            >
                                View Projects
                            </Link>
                            <h2 className="text-3xl font-bold mb-4 mt-8">Contact</h2>
                            <p className="text-lg">I am always looking for new opportunities to learn and grow as a developer. If you have a project you would like to discuss, please feel free to contact me.</p>
                            <div className="flex flex-col bg-neutral-400 dark:bg-neutral-700 p-4 rounded-md shadow-md m-2">
                                <h3 className="text-xl font-bold">Contact</h3>
                                <p>Email:
                                    <a href="mailto:spoekle@spoekle.com" className="text-blue-500 ml-1">
                                        spoekle@spoekle.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default About;
