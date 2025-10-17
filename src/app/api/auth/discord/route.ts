import { NextRequest, NextResponse } from 'next/server';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';

export async function GET(request: NextRequest) {
  const scope = 'identify email';
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    DISCORD_REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scope)}&prompt=none`;

  return NextResponse.redirect(discordAuthUrl);
}
