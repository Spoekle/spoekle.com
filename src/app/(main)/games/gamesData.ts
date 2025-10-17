import { ReactNode } from 'react';
import axios from 'axios';

export interface GameDownload {
  title: string;
  description: string;
  downloadUrl: string;
  buttonColor?: string;
}

export interface GameImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Game {
  _id?: string;
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  icon: string; // Icon name from react-icons
  color: string; // Tailwind gradient classes
  about: string[]; // Array of paragraphs
  review?: string; // Optional review text
  downloads?: GameDownload[];
  images?: GameImage[];
  order?: number;
  active?: boolean;
  extraContent?: ReactNode; // For custom additional content
}

// Fallback static data for development/offline use
export const gamesData: Game[] = [];

// Fetch games from API
export const fetchGames = async (includeInactive = false): Promise<Game[]> => {
  try {
    const url = includeInactive ? '/api/games?includeInactive=true' : '/api/games';
    const response = await axios.get(url);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching games from API, using fallback data:', error);
    return gamesData; // Fallback to static data
  }
};

export const getGameById = async (id: string): Promise<Game | undefined> => {
  try {
    const response = await axios.get(`/api/games/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching game from API, using fallback data:', error);
    return gamesData.find(game => game.id === id);
  }
};

export const getAllGameIds = (): string[] => {
  return gamesData.map(game => game.id);
};
