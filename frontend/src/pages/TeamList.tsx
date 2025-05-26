import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeams } from '../api/Teams/team-invite';
import { Link } from 'react-router-dom';

const TeamList = () => {
  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });

  if (isLoading) {
    return <div className="text-5xl font-semibold text-center mt-40 animate-pulse">Loading Teams...</div>;
  }

  if (error) {
    return <div className="text-5xl text-red-500 text-center mt-40">Failed to load teams.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">
      <h1 className="text-7xl font-bold mb-16 text-gray-800">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl">
        {teams.map((team) => (
          <Link to={`/display-board/${team.id}`} key={team.id}>
            <div className="bg-white rounded-3xl p-10 text-center text-5xl font-medium shadow-md hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer">
              {team.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
