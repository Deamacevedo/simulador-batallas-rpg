import chalk from 'chalk';
import figlet from 'figlet';
import cliProgress from 'cli-progress';

/**
 * Utilidades para hacer que la consola se vea súper genial
 * (SOLID - SRP: Single Responsibility - solo maneja la visualización)
 */
class Display {
    
    // Mostrar título épico del juego
    static showTitle() {
        console.clear();
        const title = figlet.textSync('RPG BATTLE', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        
        console.log(chalk.red.bold(title));
        console.log(chalk.yellow('⚔️  SIMULADOR DE BATALLAS ÉPICO  ⚔️\n'));
    }

    // Crear barra de vida genial
    static createHealthBar() {
        return new cliProgress.SingleBar({
            format: '❤️  Vida |' + chalk.red('{bar}') + '| {percentage}% | {value}/{total} HP',
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        });
    }

    // Crear barra de maná genial
    static createManaBar() {
        return new cliProgress.SingleBar({
            format: '🔵 Maná |' + chalk.blue('{bar}') + '| {percentage}% | {value}/{total} MP',
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        });
    }

    // Mostrar estadísticas de un personaje de forma genial
    static showCharacterStats(character, showBars = true) {
        console.log(chalk.cyan.bold(`\n=== ${character.name} ===`));
        console.log(chalk.yellow(`🏷️  Clase: ${character.type}`));
        console.log(chalk.green(`⭐ Nivel: ${character.level}`));
        
        if (showBars) {
            // Barra de vida
            const healthBar = this.createHealthBar();
            healthBar.start(character.maxHealth, character.health);
            healthBar.stop();
            
            // Barra de maná
            const manaBar = this.createManaBar();
            manaBar.start(character.maxMana, character.mana);
            manaBar.stop();
        }
        
        console.log(chalk.white(`⚔️  Ataque: ${character.attack}`));
        console.log(chalk.gray(`🛡️  Defensa: ${character.defense}`));
        console.log(chalk.yellow(`💨 Velocidad: ${character.speed}`));
        
        // Barra de experiencia simple
        const expPercent = Math.floor((character.exp / character.expToNext) * 100);
        console.log(chalk.magenta(`📊 EXP: ${character.exp}/${character.expToNext} (${expPercent}%)`));
    }

    // Mostrar daño de forma épica
    static showDamage(attacker, target, damage, special = false) {
        if (special) {
            console.log(chalk.red.bold(`💥 ¡${attacker.name} inflige ${damage} de daño especial a ${target.name}!`));
        } else {
            console.log(chalk.yellow(`⚔️  ${attacker.name} ataca a ${target.name} por ${damage} de daño`));
        }
        
        // Mostrar vida restante
        const healthPercent = Math.floor((target.health / target.maxHealth) * 100);
        let healthColor = chalk.green;
        
        if (healthPercent < 30) healthColor = chalk.red;
        else if (healthPercent < 60) healthColor = chalk.yellow;
        
        console.log(healthColor(`   ${target.name} tiene ${target.health}/${target.maxHealth} HP (${healthPercent}%)`));
    }

    // Mostrar curación de forma genial
    static showHealing(caster, target, healing) {
        console.log(chalk.green.bold(`✨ ${caster.name} cura a ${target.name} por ${healing} puntos!`));
        const healthPercent = Math.floor((target.health / target.maxHealth) * 100);
        console.log(chalk.green(`   ${target.name} ahora tiene ${target.health}/${target.maxHealth} HP (${healthPercent}%)`));
    }

    // Separador épico entre turnos
    static showTurnSeparator(turnNumber) {
        console.log(chalk.cyan('\n' + '═'.repeat(50)));
        console.log(chalk.cyan.bold(`              TURNO ${turnNumber}`));
        console.log(chalk.cyan('═'.repeat(50) + '\n'));
    }

    // Mostrar resultado de batalla
    static showBattleResult(winner, loser, exp = 0) {
        console.log(chalk.yellow('\n' + '🏆'.repeat(20)));
        console.log(chalk.green.bold(`¡${winner.name} GANA LA BATALLA! 🎉`));
        console.log(chalk.red(`${loser.name} ha sido derrotado... 💀`));
        
        if (exp > 0) {
            console.log(chalk.blue(`${winner.name} gana ${exp} puntos de experiencia!`));
        }
        
        console.log(chalk.yellow('🏆'.repeat(20) + '\n'));
    }

    // Mostrar subida de nivel épica
    static showLevelUp(character) {
        console.log(chalk.yellow('\n' + '✨'.repeat(30)));
        console.log(chalk.yellow.bold(`¡${character.name} SUBE AL NIVEL ${character.level}! 🎊`));
        console.log(chalk.green('¡Todas las estadísticas han mejorado!'));
        console.log(chalk.yellow('✨'.repeat(30) + '\n'));
    }

    // Mostrar opciones de batalla de forma genial
    static showBattleOptions(character) {
        console.log(chalk.cyan.bold(`\n--- Turno de ${character.name} ---`));
        console.log(chalk.white('¿Qué deseas hacer?'));
    }

    // Mostrar esquivar
    static showDodge(character) {
        console.log(chalk.magenta.bold(`💨 ¡${character.name} esquiva ágilmente el ataque!`));
    }

    // Mostrar mensaje de error genial
    static showError(message) {
        console.log(chalk.red.bold(`❌ Error: ${message}`));
    }

    // Mostrar mensaje de éxito
    static showSuccess(message) {
        console.log(chalk.green.bold(`✅ ${message}`));
    }

    // Pausa dramática
    static async pause(seconds = 2) {
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    // Presionar enter para continuar
    static async waitForEnter() {
        const inquirer = await import('inquirer');
        await inquirer.default.prompt([
            {
                type: 'input',
                name: 'continue',
                message: chalk.gray('Presiona Enter para continuar...'),
                default: ''
            }
        ]);
    }
}

export default Display;