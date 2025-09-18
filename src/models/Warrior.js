import Character from './Character.js';

/**
 * Guerrero - Especializado en ataques físicos fuertes
 * (SOLID - LSP: Liskov Substitution - puede usarse como Character)
 */
class Warrior extends Character {
    constructor(name) {
        super(name, 'Guerrero');
        
        // Bonificaciones específicas del guerrero
        this.maxHealth = 130;  // Más vida
        this.health = 130;
        this.attack = 25;      // Más ataque
        this.defense = 15;     // Más defensa
        this.speed = 8;        // Menos velocidad
        this.maxMana = 30;     // Menos maná
        this.mana = 30;
    }

    // Habilidad especial: Golpe Devastador
    specialAttack(target) {
        if (this.mana < 15) {
            return null; // No tiene suficiente maná
        }
        
        this.mana -= 15;
        const damage = Math.floor(this.attack * 1.8); // 80% más daño
        target.takeDamage(damage);
        
        return {
            name: 'Golpe Devastador',
            damage: damage,
            description: `${this.name} usa su fuerza bruta para un ataque devastador!`
        };
    }

    // Habilidad pasiva: Resistencia natural
    takeDamage(damage) {
        const reducedDamage = Math.floor(damage * 0.9); // 10% menos daño recibido
        super.takeDamage(reducedDamage);
        return reducedDamage;
    }

    // Información específica del guerrero
    getSpecialInfo() {
        return `💪 Guerrero especializado en combate cuerpo a cuerpo
        - Golpe Devastador: Ataque poderoso (Costo: 15 maná)
        - Resistencia natural: Recibe 10% menos daño
        - Alta vida y defensa, baja velocidad`;
    }
}

export default Warrior;