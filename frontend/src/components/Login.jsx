import React from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <div className="flex items-center space-x-4">
            {user ? (
                <div className="flex items-center space-x-3">
                    {user.user_metadata.avatar_url && (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full border border-gray-200"
                        />
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {user.user_metadata.full_name}
                    </span>
                    <button
                        onClick={signOut}
                        className="text-sm text-gray-500 hover:text-gray-900 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign in with Google
                </button>
            )}
        </div>
    );
};

export default Login;
