import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function RestaurantDetails() {
    const { name } = useParams();
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ user_name: '', rating: 5, review: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Assessment
                const assessRes = await fetch('http://localhost:8000/api/assess', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ restaurant_name: name })
                });
                if (assessRes.ok) {
                    const data = await assessRes.json();
                    setAssessment(data);
                } else {
                    console.error("Assessment failed");
                    setAssessment({ score: 0, summary: "Could not assess.", dairyFreeOptions: [] });
                }

                // Fetch Reviews
                const reviewsRes = await fetch(`http://localhost:8000/api/reviews?restaurant_name=${encodeURIComponent(name)}`);
                if (reviewsRes.ok) {
                    const data = await reviewsRes.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!assessment?.id) {
            alert("Cannot submit review: Restaurant ID not found.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:8000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurant_id: assessment.id,
                    ...newReview
                })
            });
            if (res.ok) {
                // Refresh reviews
                const reviewsRes = await fetch(`http://localhost:8000/api/reviews?restaurant_name=${encodeURIComponent(name)}`);
                if (reviewsRes.ok) {
                    const data = await reviewsRes.json();
                    setReviews(data);
                }
                setNewReview({ user_name: '', rating: 5, review: '' });
            } else {
                const err = await res.json();
                alert(`Failed to submit review: ${err.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Nav */}
            <nav className="bg-white shadow-sm mb-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-auto py-2">
                        <div className="flex flex-col items-start justify-center w-min whitespace-nowrap">
                            <Link to="/" className="flex flex-col items-start w-full">
                                <span className="text-3xl font-bold leading-none tracking-tight relative z-10"><span className="text-indigo-900">no</span><span className="text-indigo-600">whey</span></span>
                                <img src={logo} alt="Nowhey Logo" className="w-[110%] max-w-none h-auto object-contain -mt-4 -ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-4">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">&larr; Back to Search</Link>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">
                                {decodeURIComponent(name)}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Dairy-Free Assessment
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            {assessment && (
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Dairy-Free Score
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assessment.score >= 7 ? 'bg-green-100 text-green-800' : assessment.score >= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {assessment.score}/10
                                            </span>
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Summary
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {assessment.summary}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Recommended Options
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <ul className="list-disc pl-5 space-y-1">
                                                {assessment.dairyFreeOptions && assessment.dairyFreeOptions.map((option, idx) => (
                                                    <li key={idx}>{option}</li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </div>
                                </dl>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add a Review</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="user" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={newReview.user_name} onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                                    <input type="number" id="rating" min="0" max="5" step="0.5" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review</label>
                                    <textarea id="review" rows="3" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}></textarea>
                                </div>
                                <button type="submit" disabled={submitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Reviews
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {reviews.length > 0 ? reviews.map((review, idx) => (
                                    <li key={review.id || idx} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                {review.user_name}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    {review.rating} / 5
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {review.review}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="px-4 py-4 sm:px-6 text-gray-500 text-sm">No reviews yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantDetails;
