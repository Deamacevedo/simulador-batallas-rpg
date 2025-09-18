import GameService from './src/services/GameService.js';
import Display from './src/utils/Display.js';
import chalk from 'chalk';

// Manejo de errores global
process.on('uncaughtException', (error) => {
    console.error(chalk.red.bold('\n💥 Error inesperado:'));
    console.error(chalk.red(error.message));
    console.log(chalk.yellow('Reiniciando el juego...\n'));
});

process.on('unhandledRejection', (error) => {
    console.error(chalk.red.bold('\n💥 Error inesperado:'));
    console.error(chalk.red(error.message));
    console.log(chalk.yellow('Reiniciando el juego...\n'));
});

// Función principal
async function main() {
    try {
        // Crear instancia del juego
        const game = new GameService();
        
        // Inicializar y empezar
        await game.start();
        
    } catch (error) {
        Display.showError(`Error fatal: ${error.message}`);
        console.log(chalk.yellow('Por favor, reporta este error si persiste.'));
        process.exit(1);
    }
}

// Mensaje de bienvenida al iniciar
console.log(chalk.blue('🚀 Iniciando RPG Battle Simulator...\n'));

// Iniciar el juego
main();