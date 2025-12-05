import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import logo from '../assets/logo.png';

function Home() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/restaurant/${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Nav */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-auto py-2">
                        <div className="flex flex-col items-start justify-center w-min whitespace-nowrap">
                            <span className="text-3xl font-bold leading-none tracking-tight relative z-10"><span className="text-indigo-900">no</span><span className="text-indigo-600">whey</span></span>
                            <img src={logo} alt="Nowhey Logo" className="w-[110%] max-w-none h-auto object-contain -mt-4 -ml-1" />
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
                    <div className="mt-10 max-w-xl">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Search for a restaurant (e.g. Joe's Pizza)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Search
                            </button>
                        </form>
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
