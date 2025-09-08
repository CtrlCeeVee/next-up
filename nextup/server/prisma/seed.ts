import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.$transaction([
    prisma.matchScore.deleteMany(),
    prisma.match.deleteMany(),
    prisma.leagueNight.deleteMany(),
    prisma.playerStats.deleteMany(),
    prisma.leagueMember.deleteMany(),
    prisma.league.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✨ Creating users...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nextup.local',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Create test players
  const playerPassword = await bcrypt.hash('player123', 10);
  const players = await Promise.all([
    prisma.user.create({
      data: {
        email: 'luke@nextup.local',
        password: playerPassword,
        name: 'Luke Anderson',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luke',
      },
    }),
    prisma.user.create({
      data: {
        email: 'matt@nextup.local',
        password: playerPassword,
        name: 'Matt Johnson',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matt',
      },
    }),
    prisma.user.create({
      data: {
        email: 'morgan@nextup.local',
        password: playerPassword,
        name: 'Morgan Smith',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
      },
    }),
    prisma.user.create({
      data: {
        email: 'kyla@nextup.local',
        password: playerPassword,
        name: 'Kyla Davis',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyla',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@nextup.local',
        password: playerPassword,
        name: 'Sarah Wilson',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@nextup.local',
        password: playerPassword,
        name: 'John Brown',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma@nextup.local',
        password: playerPassword,
        name: 'Emma Taylor',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david@nextup.local',
        password: playerPassword,
        name: 'David Martinez',
        role: 'PLAYER',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      },
    }),
  ]);

  console.log('🏆 Creating leagues...');

  // Create test leagues
  const northcliffEagles = await prisma.league.create({
    data: {
      name: 'Northcliff Eagles',
      description: 'Premier pickleball league in Northcliff',
      location: 'Northcliff Recreation Center',
      schedule: 'Monday & Wednesday, 6:00 PM - 9:00 PM',
      adminId: admin.id,
      settings: {
        scoringSystem: 'RALLY',
        matchFormat: 'BEST_OF_3',
        gameToPoints: 11,
        winByTwo: true,
        skillBasedMatching: true,
        timeoutDuration: 60,
      },
    },
  });

  const sandtonStars = await prisma.league.create({
    data: {
      name: 'Sandton Stars',
      description: 'Competitive pickleball in the heart of Sandton',
      location: 'Sandton Sports Complex',
      schedule: 'Tuesday & Thursday, 7:00 PM - 10:00 PM',
      adminId: admin.id,
      settings: {
        scoringSystem: 'RALLY',
        matchFormat: 'SINGLE_GAME',
        gameToPoints: 15,
        winByTwo: true,
        skillBasedMatching: true,
        timeoutDuration: 45,
      },
    },
  });

  console.log('👥 Adding players to leagues...');

  // Add all players to Northcliff Eagles
  const leagueMembers = await Promise.all(
    players.map((player, index) =>
      prisma.leagueMember.create({
        data: {
          leagueId: northcliffEagles.id,
          userId: player.id,
          role: index === 0 ? 'ORGANIZER' : 'PLAYER',
          joinedAt: new Date(),
        },
      })
    )
  );

  // Add some players to Sandton Stars
  await Promise.all(
    players.slice(0, 4).map((player) =>
      prisma.leagueMember.create({
        data: {
          leagueId: sandtonStars.id,
          userId: player.id,
          role: 'PLAYER',
          joinedAt: new Date(),
        },
      })
    )
  );

  console.log('📊 Creating player stats...');

  // Initialize player stats for Northcliff Eagles
  await Promise.all(
    players.map((player, index) =>
      prisma.playerStats.create({
        data: {
          leagueId: northcliffEagles.id,
          userId: player.id,
          rating: 1200 + Math.random() * 400, // Random ELO between 1200-1600
          wins: Math.floor(Math.random() * 20),
          losses: Math.floor(Math.random() * 15),
          gamesPlayed: Math.floor(Math.random() * 35),
          pointsFor: Math.floor(Math.random() * 500),
          pointsAgainst: Math.floor(Math.random() * 450),
        },
      })
    )
  );

  console.log('🗓️ Creating league nights...');

  // Create a recent league night
  const leagueNight = await prisma.leagueNight.create({
    data: {
      leagueId: northcliffEagles.id,
      date: new Date(),
      status: 'IN_PROGRESS',
      courts: {
        available: [
          { number: 1, name: 'Court 1' },
          { number: 2, name: 'Court 2' },
          { number: 3, name: 'Court 3' },
        ],
      },
      attendees: players.map((p) => p.id),
    },
  });

  // Create an upcoming league night
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 2);
  await prisma.leagueNight.create({
    data: {
      leagueId: northcliffEagles.id,
      date: upcomingDate,
      status: 'SCHEDULED',
      courts: {
        available: [
          { number: 1, name: 'Court 1' },
          { number: 2, name: 'Court 2' },
        ],
      },
    },
  });

  console.log('🎾 Creating sample matches...');

  // Create some sample matches for the current league night
  const match1 = await prisma.match.create({
    data: {
      leagueNightId: leagueNight.id,
      courtNumber: 1,
      status: 'COMPLETED',
      team1Players: [players[0].id, players[1].id],
      team2Players: [players[2].id, players[3].id],
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(Date.now() - 1800000), // 30 minutes ago
    },
  });

  await prisma.matchScore.create({
    data: {
      matchId: match1.id,
      gameNumber: 1,
      team1Score: 11,
      team2Score: 9,
      confirmed: true,
    },
  });

  const match2 = await prisma.match.create({
    data: {
      leagueNightId: leagueNight.id,
      courtNumber: 2,
      status: 'IN_PROGRESS',
      team1Players: [players[4].id, players[5].id],
      team2Players: [players[6].id, players[7].id],
      startTime: new Date(Date.now() - 900000), // 15 minutes ago
    },
  });

  const match3 = await prisma.match.create({
    data: {
      leagueNightId: leagueNight.id,
      courtNumber: 3,
      status: 'QUEUED',
      team1Players: [players[0].id, players[3].id],
      team2Players: [players[1].id, players[2].id],
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Test accounts:');
  console.log('  Admin: admin@nextup.local / admin123');
  console.log('  Players: luke@nextup.local, matt@nextup.local, etc. / player123');
  console.log('');
  console.log(`Created ${players.length} players`);
  console.log(`Created 2 leagues`);
  console.log(`Created 3 matches`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });