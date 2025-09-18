import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import Display from '../utils/Display.js';
import Warrior from '../models/Warrior.js';
import Mage from '../models/Mage.js';
import Archer from '../models/Archer.js';

/**
 * Servicio que maneja todas las batallas
 * (SOLID - SRP: Single Responsibility - solo maneja batallas)
 */
class BattleService {
    
    // Crear enemigo aleatorio
    static createRandomEnemy(playerLevel = 1) {
        const classes = [Warrior, Mage, Archer];
        const names = [
            'Goblin Feroz', 'Esqueleto Guerrero', 'Orco Salvaje', 
            'Mago Oscuro', 'Bandido', 'Lobo Gigante',
            'Dragón Bebé', 'Slime Gigante', 'Araña Venenosa'
        ];
        
        const RandomClass = classes[Math.floor(Math.random() * classes.length)];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const enemy = new RandomClass(randomName);
        
        // Ajustar nivel del enemigo cerca del jugador
        const enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
        
        for (let i = 1; i < enemyLevel; i++) {
            enemy.levelUp();
        }
        
        return enemy;
    }

    // IA simple para enemigos
    static async enemyAI(enemy, player) {
        const spinner = ora('El enemigo está pensando...').start();
        await Display.pause(1);
        spinner.stop();

        // IA súper simple: 40% ataque especial, 60% ataque normal
        const useSpecial = Math.random() < 0.4;
        
        if (useSpecial) {
            const result = enemy.specialAttack(player);
            if (result) {
                Display.showDamage(enemy, player, result.damage, true);
                console.log(chalk.italic(result.description));
                return;
            }
        }
        
        // Ataque normal
        const damage = enemy.basicAttack(player);
        Display.showDamage(enemy, player, damage);
    }

    // Mostrar opciones de batalla
    static async getPlayerAction(player, enemy) {
        const choices = [
            { name: '⚔️  Ataque Básico', value: 'basic' },
            { name: '✨ Ataque Especial', value: 'special' }
        ];

        // Si es mago, agregar opción de curación
        if (player.type === 'Mago' && player.mana >= 25) {
            choices.push({ name: '💚 Curarse', value: 'heal' });
        }

        Display.showBattleOptions(player);
        
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Elige tu acción:',
                choices: choices
            }
        ]);

        return action;
    }

    // Ejecutar acción del jugador
    static async executePlayerAction(action, player, enemy) {
        switch (action) {
            case 'basic':
                const damage = player.basicAttack(enemy);
                Display.showDamage(player, enemy, damage);
                break;

            case 'special':
                const result = player.specialAttack(enemy);
                if (result) {
                    Display.showDamage(player, enemy, result.damage, true);
                    console.log(chalk.italic(result.description));
                } else {
                    Display.showError('No tienes suficiente maná para el ataque especial!');
                    // Ataque básico como backup
                    const basicDamage = player.basicAttack(enemy);
                    Display.showDamage(player, enemy, basicDamage);
                }
                break;

            case 'heal':
                if (player.type === 'Mago') {
                    const healResult = player.healSpell();
                    if (healResult) {
                        Display.showHealing(player, player, healResult.heal);
                        console.log(chalk.italic(healResult.description));
                    } else {
                        Display.showError('No tienes suficiente maná para curarte!');
                    }
                }
                break;
        }
    }

    // Batalla principal súper simple
    static async startBattle(player, enemy = null) {
        Display.showTitle();
        
        // Si no hay enemigo, crear uno aleatorio
        if (!enemy) {
            enemy = this.createRandomEnemy(player.level);
        }

        console.log(chalk.red.bold(`\n🔥 ¡Aparece ${enemy.name} (Nivel ${enemy.level})!`));
        console.log(chalk.yellow('¡La batalla comienza!\n'));

        await Display.pause(2);

        let turnNumber = 1;
        
        // Bucle principal de batalla
        while (player.isAlive() && enemy.isAlive()) {
            Display.showTurnSeparator(turnNumber);
            
            // Mostrar estadísticas actuales
            console.log(chalk.blue.bold('📊 ESTADO ACTUAL:'));
            Display.showCharacterStats(player);
            Display.showCharacterStats(enemy);
            
            await Display.pause(1);

            // Determinar orden por velocidad
            const playerFirst = player.speed >= enemy.speed;
            
            if (playerFirst) {
                // Turno del jugador
                const action = await this.getPlayerAction(player, enemy);
                await this.executePlayerAction(action, player, enemy);
                
                await Display.pause(1);
                
                // Turno del enemigo (si sigue vivo)
                if (enemy.isAlive()) {
                    await this.enemyAI(enemy, player);
                }
            } else {
                // Turno del enemigo primero
                await this.enemyAI(enemy, player);
                
                await Display.pause(1);
                
                // Turno del jugador (si sigue vivo)
                if (player.isAlive()) {
                    const action = await this.getPlayerAction(player, enemy);
                    await this.executePlayerAction(action, player, enemy);
                }
            }

            // Regeneración de maná para magos
            if (player.type === 'Mago') {
                player.regenerateMana();
            }
            if (enemy.type === 'Mago') {
                enemy.regenerateMana();
            }

            turnNumber++;
            await Display.pause(2);
        }

        // Resultado de la batalla
        if (player.isAlive()) {
            const expGained = Math.floor(enemy.level * 25 + Math.random() * 20);
            Display.showBattleResult(player, enemy, expGained);
            
            const leveledUp = player.gainExp(expGained);
            if (leveledUp) {
                Display.showLevelUp(player);
            }
            
            return { winner: player, exp: expGained, leveledUp };
        } else {
            Display.showBattleResult(enemy, player);
            return { winner: enemy, exp: 0, leveledUp: false };
        }
    }

    // Batalla PvP (Jugador vs Jugador)
    static async startPvPBattle(player1, player2) {
        Display.showTitle();
        
        console.log(chalk.yellow.bold(`\n⚔️  BATALLA PvP ⚔️`));
        console.log(chalk.cyan(`${player1.name} VS ${player2.name}`));
        console.log(chalk.yellow('¡Que comience la batalla!\n'));

        await Display.pause(2);

        let turnNumber = 1;
        let currentPlayer = player1.speed >= player2.speed ? player1 : player2;
        let opponent = currentPlayer === player1 ? player2 : player1;
        
        // Bucle principal de batalla PvP
        while (player1.isAlive() && player2.isAlive()) {
            Display.showTurnSeparator(turnNumber);
            
            // Mostrar estadísticas
            console.log(chalk.blue.bold('📊 ESTADO ACTUAL:'));
            Display.showCharacterStats(player1);
            Display.showCharacterStats(player2);
            
            await Display.pause(1);

            // Turno del jugador actual
            console.log(chalk.green.bold(`\n🎯 Turno de ${currentPlayer.name}`));
            const action = await this.getPlayerAction(currentPlayer, opponent);
            await this.executePlayerAction(action, currentPlayer, opponent);
            
            // Cambiar turno
            [currentPlayer, opponent] = [opponent, currentPlayer];
            
            // Regeneración de maná
            if (player1.type === 'Mago') player1.regenerateMana();
            if (player2.type === 'Mago') player2.regenerateMana();

            turnNumber++;
            await Display.pause(2);
        }

        // Resultado PvP
        const winner = player1.isAlive() ? player1 : player2;
        const loser = winner === player1 ? player2 : player1;
        
        Display.showBattleResult(winner, loser);
        return { winner, loser };
    }
}

export default BattleService;