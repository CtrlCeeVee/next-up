// League Controller
// Handles all league-related business logic

const mockLeagues = [
  {
    id: 1,
    name: "Northcliff Eagles",
    location: "Northcliff Sports Club", 
    address: "123 Northcliff Ave, Northcliff",
    totalPlayers: 45,
    leagueDays: ["Monday", "Wednesday"],
    startTime: "6:00 PM",
    skillLevel: "Intermediate",
    description: "Competitive league for intermediate players",
    isActive: true
  },
  {
    id: 2,
    name: "Sandton Smashers", 
    location: "Sandton Recreation Center",
    address: "456 Sandton Drive, Sandton",
    totalPlayers: 32,
    leagueDays: ["Tuesday", "Thursday"],
    startTime: "7:00 PM",
    skillLevel: "Advanced",
    description: "Fast-paced games for experienced players",
    isActive: true
  },
  {
    id: 3,
    name: "Rosebank Rackets",
    location: "Rosebank Club",
    address: "789 Rosebank Rd, Rosebank", 
    totalPlayers: 28,
    leagueDays: ["Wednesday", "Friday"],
    startTime: "6:30 PM",
    skillLevel: "Beginner",
    description: "Welcoming league for new players",
    isActive: true
  },
  {
    id: 4,
    name: "Centurion Challengers",
    location: "Centurion Sports Complex",
    address: "321 Centurion Blvd, Centurion",
    totalPlayers: 18,
    leagueDays: ["Saturday"],
    startTime: "9:00 AM",
    skillLevel: "Mixed",
    description: "Weekend league for all skill levels",
    isActive: false
  }
];

// Get all leagues
const getAllLeagues = async (req, res) => {
  try {
    // For now, return mock data
    // Later this will fetch from Supabase
    
    res.json({
      success: true,
      data: mockLeagues,
      count: mockLeagues.length
    });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leagues',
      error: error.message
    });
  }
};

// Get league by ID
const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const league = mockLeagues.find(l => l.id === parseInt(id));
    
    if (!league) {
      return res.status(404).json({
        success: false,
        message: 'League not found'
      });
    }
    
    res.json({
      success: true,
      data: league
    });
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch league',
      error: error.message
    });
  }
};

module.exports = {
  getAllLeagues,
  getLeagueById
};