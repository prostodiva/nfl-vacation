import type { StadiumCoordinates } from '../store/types/algorithmTypes';

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

export const ANIMATION_CONFIG = {
    NODE_INTERVAL: 500,
    EDGE_DURATION: 0.5,
    PULSE_DURATION: 1.5,
    DEFAULT_NODE_RADIUS: 10,
    CURRENT_NODE_RADIUS: 14,
    PULSE_RADIUS: 20,
} as const;

export const COLORS = {
    PRIMARY: '#f76d1b',
    TRANSPARENT: 'transparent',
} as const;

export const stadiumCoordinates: StadiumCoordinates = {
    "Minnesota Vikings":  { x: 718, y: 166 } ,
    "Green Bay Packers": { x: 803, y: 175 },
    "Chicago Bears": { x: 814, y: 247 },
    "Indianapolis Colts": { x: 852, y: 269 },
    "Detroit Lions": { x: 891, y: 203 },
    "Cleveland Browns": { x: 920, y: 238 },
    "Pittsburgh Steelers": { x: 965, y: 245 },
    "Buffalo Bills": { x: 977, y: 187 },
    "New England Patriots": { x: 1099, y: 172 },
    "New York Giants": { x: 1054, y: 219 },
    "Philadelphia Eagles": { x: 1036, y: 237 },
    "New York Jets": { x: 1054, y: 219 },
    "Baltimore Ravens": { x: 1014, y: 260 },
    "Washington Commanders": { x: 1004, y: 285 },
    "Carolina Panthers": { x: 967, y: 366 },
    "Atlanta Falcons": { x: 897, y: 414 },
    "Cincinnati Bengals": { x: 891, y: 285 },
    "Tennessee Titans": { x: 837, y: 370 },
    "Kansas City Chiefs": { x: 706, y: 299 },
    "Dallas Cowboys": { x: 648, y: 448 },
    "Houston Texans": { x: 680, y: 537 },
    "New Orleans Saints": { x: 784, y: 522 },
    "Tampa Bay Buccaneers": { x: 968, y: 548 },
    "Jacksonville Jaguars": { x: 966, y: 502 },
    "Miami Dolphins":  { x: 1004, y: 600 },
    "Arizona Cardinals": { x: 367, y: 406 },
    "Los Angeles Chargers": { x: 252, y: 373 },
    "San Francisco 49ers": { x: 199, y: 279 },
    "Las Vegas Raiders": { x: 313, y: 334 },
    "Los Angeles Rams": { x: 252, y: 373 },
    "Seattle Seahawks": { x: 262, y: 52 },
    "Denver Broncos": { x: 635, y: 455 },
};