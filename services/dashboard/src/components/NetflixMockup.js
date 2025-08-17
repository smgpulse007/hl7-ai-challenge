import React, { useState, useEffect } from 'react';
import { Play, Star } from 'lucide-react';

const NetflixMockup = ({ onTransition }) => {
  const [showTransition, setShowTransition] = useState(false);

  const oldMovies = [
    { title: "The Matrix", year: "1999", rating: "8.7", poster: "🎬" },
    { title: "Titanic", year: "1997", rating: "7.8", poster: "🚢" },
    { title: "Jurassic Park", year: "1993", rating: "8.1", poster: "🦕" },
    { title: "The Lion King", year: "1994", rating: "8.5", poster: "🦁" },
    { title: "Forrest Gump", year: "1994", rating: "8.8", poster: "🏃" },
    { title: "Pulp Fiction", year: "1994", rating: "8.9", poster: "🔫" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(true);
      if (onTransition) {
        setTimeout(onTransition, 1000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTransition]);

  if (showTransition) {
    return (
      <div style={{
        backgroundColor: '#000',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        animation: 'fadeOut 1s ease-in-out'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏥</div>
          <div>Now imagine your care is managed the same way...</div>
          <div style={{ fontSize: '18px', marginTop: '10px', opacity: 0.7 }}>
            Outdated lists, late nudges
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#141414',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Netflix Header */}
      <div style={{
        padding: '20px 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #333'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#e50914'
        }}>
          NETFLIX
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
          <span>Home</span>
          <span>TV Shows</span>
          <span>Movies</span>
          <span>My List</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 50px' }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#333',
          borderRadius: '8px',
          padding: '40px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.1\'%3E%3Cpolygon fill=\'%23fff\' points=\'50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40\'/%3E%3C/g%3E%3C/svg%3E")'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
            🎬 Movies You Watched Last Year
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.8 }}>
            Same old recommendations from your viewing history
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Play size={20} fill="black" />
              Play
            </button>
            <button style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '12px 30px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              More Info
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>
            📼 Your Stale Recommendations
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.7 }}>
            Based on what you watched years ago...
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {oldMovies.map((movie, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#222',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <div style={{
                  height: '280px',
                  backgroundColor: '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px'
                }}>
                  {movie.poster}
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {movie.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', opacity: 0.7 }}>
                      {movie.year}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Star size={14} fill="#ffd700" color="#ffd700" />
                      <span style={{ fontSize: '14px' }}>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Message */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '2px solid #e50914'
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#e50914' }}>
            💸 Would you pay $25/month for this?
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.8 }}>
            Probably not. Stale recommendations based on old data don't create value.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NetflixMockup;
