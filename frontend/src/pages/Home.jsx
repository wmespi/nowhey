import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import logo from '../assets/logo.png';
import Login from '../components/Login';

function Home() {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Geolocation permission denied or failed:", error);
                }
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Nav */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-auto pt-2 pb-0">
                        <div className="flex flex-col items-center justify-center w-min whitespace-nowrap">
                            <span className="text-3xl font-bold leading-none tracking-tight relative z-10"><span className="text-indigo-900">no</span><span className="text-indigo-600">whey</span></span>
                            <img src={logo} alt="Nowhey Logo" className="w-[135%] max-w-none h-auto object-contain -mt-12 -mb-10" />
                        </div>
                        <div className="flex items-center">
                            <Login />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-indigo-800">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-40"
                        src={heroImage}
                        alt="Dairy-free food spread"
                    />
                    <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Find Dairy-Free Friendly Restaurants
                    </h1>
                    <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                        Discover safe places to eat with our AI-powered dairy-free assessments and community reviews.
                    </p>
                    <div className="mt-10 max-w-xl relative">
                        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Search for a restaurant (e.g. Joe's Pizza)"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setError(null);
                                    if (e.target.value.length > 2) {
                                        const apiUrl = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000')).replace(/\/$/, '');
                                        console.log("Searching with API URL:", apiUrl);

                                        let searchUrl = `${apiUrl}/api/places/search?query=${encodeURIComponent(e.target.value)}`;
                                        if (location && location.lat && location.lng) {
                                            searchUrl += `&lat=${location.lat}&lng=${location.lng}`;
                                        }

                                        fetch(searchUrl)
                                            .then(res => {
                                                if (!res.ok) throw new Error(res.statusText);
                                                return res.json();
                                            })
                                            .then(data => setResults(data.places || []))
                                            .catch(err => {
                                                console.error(err);
                                                setError("Search failed. Check backend logs/API key.");
                                                setResults([]);
                                            });
                                    } else {
                                        setResults([]);
                                    }
                                }}
                            />
                        </form>
                        {error && (
                            <div className="absolute z-10 mt-1 w-full bg-red-50 text-red-700 p-2 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}
                        {results.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {results.map((place) => (
                                    <li
                                        key={place.id}
                                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white text-gray-900"
                                        onClick={() => navigate(`/restaurant/${place.id}`)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate">{place.displayName.text}</span>
                                            <span className="text-xs text-gray-500 truncate hover:text-indigo-200">{place.formattedAddress}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Feature Section (Optional placeholder) */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Eat with confidence.
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Our AI analyzes restaurant menus and reviews to give you a dairy-free score you can trust.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
