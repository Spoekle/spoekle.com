import { NextResponse } from 'next/server';

interface LanguageStats {
  [key: string]: number;
}

// Generate a consistent color from a string hash
function generateColorFromHash(str: string): string {
  // Create a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate HSL color with controlled saturation and lightness
  // Hue: 0-360 (full spectrum)
  const hue = Math.abs(hash % 360);
  
  const saturation = 70;
  const lightness = 60;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export async function GET() {
  try {
    const username = 'Spoekle';
    const token = process.env.GITHUB_TOKEN;

    // Fetch user's repositories
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { 
        headers,
        next: { revalidate: 3600 }
      }
    );

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await reposResponse.json();

    // Aggregate language statistics
    const languageStats: LanguageStats = {};
    let totalBytes = 0;

    // Fetch languages for each repository
    await Promise.all(
      repos.map(async (repo: any) => {
        if (repo.fork) return;

        const langResponse = await fetch(repo.languages_url, { 
          headers,
          next: { revalidate: 3600 }
        });
        
        if (langResponse.ok) {
          const languages = await langResponse.json();
          
          // Add to total
          Object.entries(languages).forEach(([lang, bytes]) => {
            languageStats[lang] = (languageStats[lang] || 0) + (bytes as number);
            totalBytes += bytes as number;
          });
        }
      })
    );

    // Calculate percentages and sort
    const languagePercentages = Object.entries(languageStats)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: ((bytes / totalBytes) * 100).toFixed(2),
        color: generateColorFromHash(language), // Generate color from language name
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10); // Top 10 languages

    return NextResponse.json({
      success: true,
      data: languagePercentages,
      totalBytes,
    });
  } catch (error) {
    console.error('Error fetching GitHub language stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch language statistics' },
      { status: 500 }
    );
  }
}
