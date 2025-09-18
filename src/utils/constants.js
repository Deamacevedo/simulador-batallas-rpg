/**
 * Constantes del juego RPG Battle Simulator
 */

export const GAME_CONFIG = {
    // Configuración general
    MAX_LEVEL: 50,
    BASE_EXP_TO_NEXT: 100,
    EXP_MULTIPLIER: 1.2,
    
    // Configuración de batalla
    MAX_TURNS: 50, // Para evitar batallas infinitas
    CRITICAL_CHANCE: 0.1, // 10% de probabilidad de crítico
    
    // Colores para diferentes tipos de daño
    DAMAGE_COLORS: {
        PHYSICAL: 'yellow',
        MAGICAL: 'magenta',
        CRITICAL: 'red',
        HEALING: 'green'
    }
};

export const CHARACTER_CLASSES = {
    WARRIOR: {
        name: 'Guerrero',
        emoji: '💪',
        description: 'Especializado en combate cuerpo a cuerpo',
        baseStats: {
            health: 130,
            attack: 25,
            defense: 15,
            speed: 8,
            mana: 30
        }
    },
    MAGE: {
        name: 'Mago',
        emoji: '🔮',
        description: 'Maestro de las artes místicas',
        baseStats: {
            health: 80,
            attack: 15,
            defense: 8,
            speed: 12,
            mana: 100
        }
    },
    ARCHER: {
        name: 'Arquero',
        emoji: '🏹',
        description: 'Rápido y preciso a distancia',
        baseStats: {
            health: 90,
            attack: 22,
            defense: 12,
            speed: 18,
            mana: 60
        }
    }
};

export const ENEMY_NAMES = [
    // Enemigos comunes
    'Goblin Feroz', 'Esqueleto Guerrero', 'Orco Salvaje',
    'Bandido Encapuchado', 'Lobo Gigante', 'Araña Venenosa',
    
    // Enemigos mágicos
    'Mago Oscuro', 'Slime Gigante', 'Elemental de Fuego',
    'Espíritu Maligno', 'Necromante', 'Bruja del Pantano',
    
    // Enemigos épicos
    'Dragón Bebé', 'Minotauro', 'Troll de las Montañas',
    'Caballero Caído', 'Demonio Menor', 'Golem de Piedra'
];

export const BATTLE_MESSAGES = {
    START: [
        '¡La batalla comienza!',
        '¡Prepárate para el combate!',
        '¡El duelo ha comenzado!',
        '¡Que inicie la lucha épica!'
    ],
    VICTORY: [
        '¡Victoria aplastante!',
        '¡Triunfo épico!',
        '¡Has ganado gloriosamente!',
        '¡Eres el campeón!'
    ],
    DEFEAT: [
        'Has sido derrotado...',
        'La batalla se ha perdido...',
        'Tu aventura termina aquí...',
        'El enemigo ha prevalecido...'
    ]
};

export const SPECIAL_ATTACKS = {
    WARRIOR: {
        name: 'Golpe Devastador',
        emoji: '💥',
        manaCost: 15,
        damageMultiplier: 1.8,
        description: 'Un ataque brutal que causa daño masivo'
    },
    MAGE: {
        name: 'Bola de Fuego',
        emoji: '🔥',
        manaCost: 20,
        damageMultiplier: 2.5,
        description: 'Una esfera de fuego mágico devastador'
    },
    ARCHER: {
        name: 'Flecha Múltiple',
        emoji: '🎯',
        manaCost: 18,
        arrows: 3,
        damageMultiplier: 0.7,
        description: 'Múltiples flechas disparadas con precisión'
    }
};

export const LEVEL_UP_BONUSES = {
    HEALTH_BONUS: 20,
    ATTACK_BONUS: 5,
    DEFENSE_BONUS: 3,
    SPEED_BONUS: 2,
    MANA_BONUS: 10
};

export const FILE_PATHS = {
    SAVE_FILE: 'src/data/saved-characters.json',
    BACKUP_FOLDER: 'src/data/backups/'
};

export const UI_SYMBOLS = {
    HEALTH: '❤️',
    MANA: '🔵',
    ATTACK: '⚔️',
    DEFENSE: '🛡️',
    SPEED: '💨',
    LEVEL: '⭐',
    EXP: '📊',
    VICTORY: '🏆',
    DEFEAT: '💀',
    CRITICAL: '💥',
    DODGE: '💨',
    HEAL: '✨'
};

// Mensajes de ayuda
export const HELP_MESSAGES = {
    COMBAT: `
🎮 AYUDA DE COMBATE:
- Ataque Básico: Daño normal sin costo de maná
- Ataque Especial: Más daño pero consume maná
- Curación (solo Mago): Restaura vida gastando maná

💡 TIPS:
- Los arqueros pueden esquivar ataques
- Los magos regeneran maná cada turno
- Los guerreros reciben menos daño
`,
    CLASSES: `
💪 GUERRERO: Tank con alta vida y defensa
🔮 MAGO: Atacante mágico con curación
🏹 ARQUERO: Rápido con probabilidad de esquivar
`,
    CONTROLS: `
🎮 CONTROLES:
- Usa las flechas para navegar menús
- Enter para seleccionar
- Ctrl+C para salir en cualquier momento
`
};