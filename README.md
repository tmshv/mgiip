# MGIIP Map

Interactive map application visualizing urban development grants data across Russia. Displays settlements that participated in urban improvement grant competitions, showing application and award statistics from 2018 to present.

## Features

- Interactive map with point clustering for thousands of settlements
- Data visualization showing grant applications and awards by year
- Toggle between "applied" and "winners" view modes
- Popup details with settlement information (type, region, population, win rate)
- Custom Mapbox style

## Prerequisites

- [mise](https://mise.jdx.dev/) - runtime version manager
- Mapbox account with access token

## Setup

1. Clone the repository:

```bash
git clone https://github.com/tmshv/mgiip.git
cd mgiip
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with your Mapbox credentials:

```sh
cp .env.example .env
```

```
VITE_MAPBOX_ACCESS_KEY=your_mapbox_access_token
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/standard
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Scripts

| Command             | Description                  |
|---------------------|------------------------------|
| `npm run dev`       | Start development server     |
| `npm run build`     | Build for production         |
| `npm run preview`   | Preview production build     |
| `npm run typecheck` | Run TypeScript type checking |

## Data Format

The GeoJSON datasets contain settlement points with properties including:

- `нп` - Settlement name
- `тип` - Settlement type (city, village, etc.)
- `регион` - Region
- `федеральный округ` - Federal district
- `население` - Population
- `подавался` - Total applications submitted
- `победители` - Total grants won
- `доля побед` - Win rate percentage
- Year-specific fields for applications and awards (2018-2025)

## License

MIT
