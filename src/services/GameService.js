import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import Display from '../utils/Display.js';
import BattleService from './BattleService.js';
import SaveService from './SaveService.js';
import Warrior from '../models/Warrior.js';
import Mage from '../models/Mage.js';
import Archer from '../models/Archer.js';

/**
 * Servicio principal que coordina todo el juego
 * (SOLID - SRP: Single Responsibility - coordinación general)
 */
class GameService {
    constructor() {
        this.saveService = new SaveService();
        this.currentCharacter = null;
    }

    // Inicializar el juego
    async start() {
        Display.showTitle();
        await Display.pause(1);
        
        console.log(chalk.green('¡Bienvenido al simulador de batallas RPG más épico!'));
        console.log(chalk.cyan('Prepárate para aventuras increíbles...\n'));
        
        await this.showMainMenu();
    }

    // Menú principal súper intuitivo
    async showMainMenu() {
        while (true) {
            Display.showTitle();
            
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: '🎮 ¿Qué deseas hacer?',
                    choices: [
                        { name: '⚔️  Crear Nuevo Personaje', value: 'create' },
                        { name: '📁 Cargar Personaje Guardado', value: 'load' },
                        { name: '🏟️  Batalla vs IA', value: 'battle' },
                        { name: '👥 Batalla PvP', value: 'pvp' },
                        { name: '📊 Ver Estadísticas', value: 'stats' },
                        { name: '❌ Salir', value: 'exit' }
                    ]
                }
            ]);

            switch (action) {
                case 'create':
                    await this.createCharacter();
                    break;
                case 'load':
                    await this.loadCharacter();
                    break;
                case 'battle':
                    await this.startBattleVsAI();
                    break;
                case 'pvp':
                    await this.startPvPBattle();
                    break;
                case 'stats':
                    await this.showStatistics();
                    break;
                case 'exit':
                    await this.exitGame();
                    return;
            }
        }
    }

    // Crear personaje nuevo
    async createCharacter() {
        Display.showTitle();
        console.log(chalk.yellow.bold('🎭 CREACIÓN DE PERSONAJE\n'));

        // Pedir nombre
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: '📝 ¿Cómo se llamará tu héroe?',
                validate: (input) => {
                    if (input.trim().length === 0) {
                        return 'El nombre no puede estar vacío';
                    }
                    if (input.trim().length > 20) {
                        return 'El nombre es muy largo (máximo 20 caracteres)';
                    }
                    return true;
                }
            }
        ]);

        // Verificar si ya existe
        const existing = await this.saveService.getCharacterByName(name.trim());
        if (existing) {
            Display.showError('Ya existe un personaje con ese nombre');
            await Display.waitForEnter();
            return;
        }

        // Elegir clase
        const { characterClass } = await inquirer.prompt([
            {
                type: 'list',
                name: 'characterClass',
                message: '⚔️  Elige la clase de tu personaje:',
                choices: [
                    {
                        name: '💪 Guerrero - Fuerte en combate cuerpo a cuerpo',
                        value: 'warrior'
                    },
                    {
                        name: '🔮 Mago - Maestro de las artes místicas',
                        value: 'mage'
                    },
                    {
                        name: '🏹 Arquero - Rápido y preciso a distancia',
                        value: 'archer'
                    }
                ]
            }
        ]);

        // Crear el personaje
        const spinner = ora('Creando tu personaje épico...').start();
        await Display.pause(1);

        let newCharacter;
        switch (characterClass) {
            case 'warrior':
                newCharacter = new Warrior(name.trim());
                break;
            case 'mage':
                newCharacter = new Mage(name.trim());
                break;
            case 'archer':
                newCharacter = new Archer(name.trim());
                break;
        }

        spinner.succeed('¡Personaje creado exitosamente!');

        // Mostrar información del nuevo personaje
        console.log(chalk.green.bold('\n✨ ¡Tu héroe ha nacido! ✨'));
        Display.showCharacterStats(newCharacter);
        console.log(chalk.cyan('\nHabilidades especiales:'));
        console.log(newCharacter.getSpecialInfo());

        // Guardar automáticamente
        await this.saveService.saveCharacter(newCharacter);
        this.currentCharacter = newCharacter;

        Display.showSuccess('\nPersonaje guardado automáticamente');
        await Display.waitForEnter();
    }

    // Cargar personaje guardado
    async loadCharacter() {
        const characters = await this.saveService.loadCharacters();
        
        if (characters.length === 0) {
            Display.showError('No tienes personajes guardados');
            await Display.waitForEnter();
            return;
        }

        Display.showTitle();
        console.log(chalk.yellow.bold('📁 CARGAR PERSONAJE\n'));

        const choices = characters.map(c => ({
            name: `${c.name} (${c.type}, Nivel ${c.level})`,
            value: c.id
        }));

        choices.push({ name: '🔙 Volver al menú principal', value: 'back' });

        const { characterId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'characterId',
                message: 'Selecciona tu personaje:',
                choices: choices
            }
        ]);

        if (characterId === 'back') {
            return;
        }

        const spinner = ora('Cargando tu héroe...').start();
        await Display.pause(1);

        const character = await this.saveService.loadCharacter(characterId);
        
        if (character) {
            spinner.succeed('¡Personaje cargado exitosamente!');
            this.currentCharacter = character;
            
            console.log(chalk.green.bold('\n🎉 ¡Bienvenido de vuelta, héroe!'));
            Display.showCharacterStats(character);
        } else {
            spinner.fail('Error al cargar el personaje');
        }

        await Display.waitForEnter();
    }

    // Batalla vs IA
    async startBattleVsAI() {
        if (!this.currentCharacter) {
            Display.showError('Primero debes crear o cargar un personaje');
            await Display.waitForEnter();
            return;
        }

        // Curar al personaje antes de la batalla
        this.currentCharacter.health = this.currentCharacter.maxHealth;
        this.currentCharacter.mana = this.currentCharacter.maxMana;

        const result = await BattleService.startBattle(this.currentCharacter);
        
        // Guardar progreso
        if (result.winner === this.currentCharacter) {
            await this.saveService.saveCharacter(this.currentCharacter);
            
            const stats = await this.saveService.loadGameStats();
            stats.battlesWon++;
            stats.totalExp += result.exp;
            await this.saveService.saveGameStats(stats);
            
            Display.showSuccess('Progreso guardado automáticamente');
        } else {
            const stats = await this.saveService.loadGameStats();
            stats.battlesLost++;
            await this.saveService.saveGameStats(stats);
        }

        await Display.waitForEnter();
    }

    // Batalla PvP
    async startPvPBattle() {
        const characters = await this.saveService.loadCharacters();
        
        if (characters.length < 2) {
            Display.showError('Necesitas al menos 2 personajes guardados para batalla PvP');
            await Display.waitForEnter();
            return;
        }

        Display.showTitle();
        console.log(chalk.yellow.bold('👥 BATALLA PvP\n'));

        const choices = characters.map(c => ({
            name: `${c.name} (${c.type}, Nivel ${c.level})`,
            value: c.id
        }));

        // Seleccionar primer luchador
        const { player1Id } = await inquirer.prompt([
            {
                type: 'list',
                name: 'player1Id',
                message: '👤 Selecciona el primer luchador:',
                choices: choices
            }
        ]);

        // Seleccionar segundo luchador
        const player2Choices = choices.filter(c => c.value !== player1Id);
        const { player2Id } = await inquirer.prompt([
            {
                type: 'list',
                name: 'player2Id',
                message: '👤 Selecciona el segundo luchador:',
                choices: player2Choices
            }
        ]);

        // Cargar personajes
        const player1 = await this.saveService.loadCharacter(player1Id);
        const player2 = await this.saveService.loadCharacter(player2Id);

        // Restaurar vida y maná completos
        player1.health = player1.maxHealth;
        player1.mana = player1.maxMana;
        player2.health = player2.maxHealth;
        player2.mana = player2.maxMana;

        // Iniciar batalla
        await BattleService.startPvPBattle(player1, player2);
        await Display.waitForEnter();
    }

    // Mostrar estadísticas
    async showStatistics() {
        Display.showTitle();
        console.log(chalk.yellow.bold('📊 ESTADÍSTICAS DEL JUEGO\n'));

        const spinner = ora('Cargando estadísticas...').start();
        await Display.pause(1);

        const gameStats = await this.saveService.loadGameStats();
        const charStats = await this.saveService.getCharacterStats();

        spinner.stop();

        console.log(chalk.cyan.bold('🎮 Estadísticas Generales:'));
        console.log(chalk.green(`✅ Batallas Ganadas: ${gameStats.battlesWon}`));
        console.log(chalk.red(`❌ Batallas Perdidas: ${gameStats.battlesLost}`));
        console.log(chalk.blue(`📈 Experiencia Total Ganada: ${gameStats.totalExp}`));
        
        if (gameStats.battlesWon + gameStats.battlesLost > 0) {
            const winRate = Math.floor((gameStats.battlesWon / (gameStats.battlesWon + gameStats.battlesLost)) * 100);
            console.log(chalk.yellow(`🏆 Ratio de Victoria: ${winRate}%`));
        }

        console.log(chalk.cyan.bold('\n👥 Estadísticas de Personajes:'));
        console.log(chalk.white(`📝 Total de Personajes: ${charStats.total}`));
        console.log(chalk.red(`💪 Guerreros: ${charStats.warriors}`));
        console.log(chalk.blue(`🔮 Magos: ${charStats.mages}`));
        console.log(chalk.green(`🏹 Arqueros: ${charStats.archers}`));
        console.log(chalk.yellow(`⭐ Nivel Más Alto: ${charStats.highestLevel}`));

        await Display.waitForEnter();
    }

    // Salir del juego
    async exitGame() {
        Display.showTitle();
        
        const { confirmExit } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmExit',
                message: '¿Estás seguro que quieres salir?',
                default: false
            }
        ]);

        if (confirmExit) {
            console.log(chalk.yellow('¡Gracias por jugar! ⚔️'));
            console.log(chalk.green('¡Que tengas aventuras épicas! 🎮\n'));
            process.exit(0);
        }
    }
}

export default GameService;