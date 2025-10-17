import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';

export async function GET(request: NextRequest) {
  // Get proper host for redirects
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', baseUrl));
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user info from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    await dbConnect();

    // Check if user exists with this Discord ID
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      // Check if user exists with this email
      if (discordUser.email) {
        user = await User.findOne({ email: discordUser.email });
      }

      if (user) {
        // Link Discord account to existing user
        user.discordId = discordUser.id;
        user.discordUsername = discordUser.username;
        if (discordUser.avatar) {
          user.profilePicture = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
        }
        await user.save();
      } else {
        // Create new user
        user = new User({
          username: discordUser.username,
          email: discordUser.email || `${discordUser.id}@discord.temp`,
          discordId: discordUser.id,
          discordUsername: discordUser.username,
          profilePicture: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : undefined,
          password: Math.random().toString(36).slice(-8), // Random password (won't be used)
          isApproved: false, // Require admin approval
          roles: ['user'],
        });
        await user.save();
      }
    }

    // Check if user is approved
    if (!user.isApproved) {
      return NextResponse.redirect(
        new URL('/login?error=pending_approval', baseUrl)
      );
    }

    // Generate JWT token
    const token = generateToken({
      _id: user._id?.toString() || '',
      username: user.username,
      roles: user.roles,
    });

    // Redirect to home with token
    const redirectUrl = new URL('/', baseUrl);
    redirectUrl.searchParams.set('token', token);
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Discord OAuth error:', error.response?.data || error.message);
    return NextResponse.redirect(
      new URL('/login?error=discord_auth_failed', baseUrl)
    );
  }
}
