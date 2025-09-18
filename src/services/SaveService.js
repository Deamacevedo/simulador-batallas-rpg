import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Warrior from '../models/Warrior.js';
import Mage from '../models/Mage.js';
import Archer from '../models/Archer.js';

// Para ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '..', 'data', 'saved-characters.json');

// Datos por defecto
const defaultData = {
    characters: [],
    gameStats: {
        battlesWon: 0,
        battlesLost: 0,
        totalExp: 0,
        favoriteClass: null
    }
};

/**
 * Servicio para guardar y cargar personajes
 * (SOLID - SRP: Single Responsibility - solo maneja persistencia)
 */
class SaveService {
    constructor() {
        this.adapter = new JSONFile(file, defaultData);
        this.db = new Low(this.adapter, defaultData);
        this.initialized = this.initDatabase();
    }

    // Inicializar base de datos
    async initDatabase() {
        try {
            await this.db.read();

            // Si no hay datos, usar los por defecto
            this.db.data = this.db.data || defaultData;

            await this.db.write();
            return true;
        } catch (error) {
            console.error('Error inicializando base de datos:', error);
            this.db.data = defaultData;
            await this.db.write();
            return false;
        }
    }

    // Asegurar que la DB esté inicializada antes de cualquier operación
    async ensureInitialized() {
        await this.initialized;
    }

    // Guardar personaje
    async saveCharacter(character) {
        await this.ensureInitialized();
        await this.db.read();
        
        // Buscar si el personaje ya existe
        const existingIndex = this.db.data.characters.findIndex(c => c.id === character.id);
        
        const characterData = {
            id: character.id,
            name: character.name,
            type: character.type,
            level: character.level,
            health: character.health,
            maxHealth: character.maxHealth,
            attack: character.attack,
            defense: character.defense,
            speed: character.speed,
            mana: character.mana,
            maxMana: character.maxMana,
            exp: character.exp,
            expToNext: character.expToNext,
            savedAt: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            // Actualizar personaje existente
            this.db.data.characters[existingIndex] = characterData;
        } else {
            // Agregar nuevo personaje
            this.db.data.characters.push(characterData);
        }
        
        await this.db.write();
        return true;
    }

    // Cargar todos los personajes
    async loadCharacters() {
        await this.ensureInitialized();
        await this.db.read();
        return this.db.data.characters || [];
    }

    // Cargar personaje específico y recrear instancia
    async loadCharacter(id) {
        await this.ensureInitialized();
        await this.db.read();
        const characterData = this.db.data.characters.find(c => c.id === id);
        
        if (!characterData) {
            return null;
        }

        // Recrear instancia según el tipo
        let character;
        switch (characterData.type) {
            case 'Guerrero':
                character = new Warrior(characterData.name);
                break;
            case 'Mago':
                character = new Mage(characterData.name);
                break;
            case 'Arquero':
                character = new Archer(characterData.name);
                break;
            default:
                return null;
        }

        // Restaurar datos guardados
        character.id = characterData.id;
        character.level = characterData.level;
        character.health = characterData.health;
        character.maxHealth = characterData.maxHealth;
        character.attack = characterData.attack;
        character.defense = characterData.defense;
        character.speed = characterData.speed;
        character.mana = characterData.mana;
        character.maxMana = characterData.maxMana;
        character.exp = characterData.exp;
        character.expToNext = characterData.expToNext;

        return character;
    }

    // Eliminar personaje
    async deleteCharacter(id) {
        await this.db.read();
        const index = this.db.data.characters.findIndex(c => c.id === id);
        
        if (index >= 0) {
            this.db.data.characters.splice(index, 1);
            await this.db.write();
            return true;
        }
        
        return false;
    }

    // Guardar estadísticas del juego
    async saveGameStats(stats) {
        await this.db.read();
        this.db.data.gameStats = { ...this.db.data.gameStats, ...stats };
        await this.db.write();
    }

    // Cargar estadísticas del juego
    async loadGameStats() {
        await this.db.read();
        return this.db.data.gameStats || {
            battlesWon: 0,
            battlesLost: 0,
            totalExp: 0,
            favoriteClass: null
        };
    }

    // Obtener personaje por nombre (para evitar duplicados)
    async getCharacterByName(name) {
        await this.ensureInitialized();
        await this.db.read();
        return this.db.data.characters.find(c => c.name.toLowerCase() === name.toLowerCase());
    }

    // Contar personajes por clase
    async getCharacterStats() {
        await this.db.read();
        const characters = this.db.data.characters;
        
        const stats = {
            total: characters.length,
            warriors: characters.filter(c => c.type === 'Guerrero').length,
            mages: characters.filter(c => c.type === 'Mago').length,
            archers: characters.filter(c => c.type === 'Arquero').length,
            highestLevel: characters.length > 0 ? Math.max(...characters.map(c => c.level)) : 0,
            totalExp: characters.reduce((sum, c) => sum + c.exp, 0)
        };
        
        return stats;
    }

    // Limpiar datos (útil para desarrollo)
    async clearAllData() {
        this.db.data = {
            characters: [],
            gameStats: {
                battlesWon: 0,
                battlesLost: 0,
                totalExp: 0,
                favoriteClass: null
            }
        };
        await this.db.write();
    }

    // Backup de datos
    async createBackup() {
        await this.db.read();
        const backup = {
            ...this.db.data,
            backupDate: new Date().toISOString()
        };
        
        return JSON.stringify(backup, null, 2);
    }
}

export default SaveService;