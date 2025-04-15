import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const NotFound = ({ contentAnimationDelay = 0.3 }) => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-200 dark:bg-neutral-900 transition duration-200">
            {/* Animated gradient background */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-transparent dark:from-purple-900/40 dark:via-indigo-900/20 dark:to-black animate-gradient-move" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
            </div>
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
                <Helmet>
                    <title>404 Not Found | Spoekle.com</title>
                    <meta name="description" content={'Page not found'} />
                </Helmet>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-indigo-700 dark:from-purple-300 dark:to-indigo-400 mb-4 drop-shadow-lg"
                >
                    404
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: contentAnimationDelay, duration: 0.5 }}
                    className="text-lg md:text-2xl text-neutral-700 dark:text-neutral-200 mb-8 text-center"
                >
                    Sorry, this page could not be found.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: contentAnimationDelay + 0.1, duration: 0.5 }}
                >
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/50 transition duration-300 transform hover:scale-105"
                    >
                        Go Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
