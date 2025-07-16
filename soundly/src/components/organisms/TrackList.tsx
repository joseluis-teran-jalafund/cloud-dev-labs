import React, { useEffect, useRef, useState } from 'react';
import type { Song } from '../../types/song/Song';
import { musicService } from '../../services/provider';

interface TrackListProps {
  albumId: string;
}

const TrackList: React.FC<TrackListProps> = ({ albumId }) => {
  const [tracks, setTracks] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const data = await musicService.getSongsByAlbum(albumId);
        setTracks(data);
      } catch (err) {
        setError('Failed to load tracks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [albumId]);

  const togglePlay = (track: Song) => {
    if (currentTrack?.songId === track.songId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading tracks...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (tracks.length === 0) return <div className="p-4 text-center text-gray-500">No tracks found for this album</div>;

  return (
    <div className="divide-y divide-gray-200">
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.songId === track.songId;

        return (
          <div
            key={track.songId}
            className={`flex items-center p-4 transition-colors cursor-pointer ${
              isCurrent ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => togglePlay(track)}
          >
            <div className="w-10 text-center text-gray-500 font-medium">{index + 1}</div>
            <div className="flex-1 ml-4">
              <h3 className={`font-medium ${isCurrent ? 'text-indigo-700' : 'text-gray-900'}`}>
                {track.title} {isCurrent && isPlaying && <span className="animate-pulse text-indigo-500">🎵</span>}
              </h3>
              <p className="text-sm text-gray-500">
                {track.duration ? formatDuration(track.duration) : '--:--'}
              </p>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-indigo-600 p-2 focus:outline-none"
            >
              {isCurrent && isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
                </svg>
              )}
            </button>
          </div>
        );
      })}

      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl || ''}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        hidden
      />
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default TrackList;
