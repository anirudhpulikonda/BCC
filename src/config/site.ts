export const site = {
  name: 'Best Color Codes',
  url: 'https://bestcolorcodes.com',
  // Update logo path here and all schemas update automatically
  logo: 'https://bestcolorcodes.com/favicon.svg',
  email: 'bestcolorcodes@gmail.com',
  description: 'The definitive reference for sports team brand colors. Official HEX, RGB, CMYK, and Pantone codes for every NFL, NBA, NHL, and MLB team.',
  // Add social profile URLs here as you create them
  social: [] as string[],
};

export const leagueMeta: Record<string, { full: string; sport: string; slug: string; sportPath?: string; sportLabel?: string }> = {
  NFL: { full: 'National Football League', sport: 'American Football', slug: 'nfl-team-color-codes', sportPath: '/sports/football/', sportLabel: 'Football' },
  NBA: { full: 'National Basketball Association', sport: 'Basketball', slug: 'nba-team-color-codes' },
  NHL: { full: 'National Hockey League', sport: 'Ice Hockey', slug: 'nhl-team-color-codes' },
  MLB: { full: 'Major League Baseball', sport: 'Baseball', slug: 'mlb-team-color-codes' },
};
