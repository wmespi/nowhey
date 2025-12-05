import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/restaurant/${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                        no<span className="text-indigo-600">whey</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find dairy-free friendly restaurants near you.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSearch}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="search" className="sr-only">Search for a restaurant</label>
                            <input
                                id="search"
                                name="search"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Search for a restaurant (e.g. 'Joe's Pizza')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;
