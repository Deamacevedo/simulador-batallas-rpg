import Character from './Character.js';

/**
 * Mago - Especializado en magia y curación
 * (SOLID - LSP: Liskov Substitution - puede usarse como Character)
 */
class Mage extends Character {
    constructor(name) {
        super(name, 'Mago');
        
        // Bonificaciones específicas del mago
        this.maxHealth = 80;   // Menos vida
        this.health = 80;
        this.attack = 15;      // Menos ataque físico
        this.defense = 8;      // Menos defensa
        this.speed = 12;       // Más velocidad
        this.maxMana = 100;    // Mucho más maná
        this.mana = 100;
    }

    // Habilidad especial: Bola de Fuego
    specialAttack(target) {
        if (this.mana < 20) {
            return null; // No tiene suficiente maná
        }
        
        this.mana -= 20;
        const damage = Math.floor(this.attack * 2.5); // 150% más daño mágico
        target.takeDamage(damage);
        
        return {
            name: 'Bola de Fuego',
            damage: damage,
            description: `${this.name} lanza una poderosa bola de fuego!`
        };
    }

    // Habilidad especial: Curación
    healSpell(target = this) {
        if (this.mana < 25) {
            return null;
        }
        
        this.mana -= 25;
        const healAmount = Math.floor(this.maxHealth * 0.4); // 40% de curación
        const actualHeal = Math.min(healAmount, target.maxHealth - target.health);
        target.heal(actualHeal);
        
        return {
            name: 'Curación',
            heal: actualHeal,
            description: `${this.name} usa magia curativa y restaura ${actualHeal} puntos de vida!`
        };
    }

    // Regeneración de maná pasiva
    regenerateMana() {
        this.mana = Math.min(this.maxMana, this.mana + 5);
    }

    // Información específica del mago
    getSpecialInfo() {
        return `🔮 Mago especializado en artes místicas
        - Bola de Fuego: Ataque mágico devastador (Costo: 20 maná)
        - Curación: Restaura vida (Costo: 25 maná)
        - Regeneración: +5 maná por turno
        - Alto maná y velocidad, baja defensa`;
    }
}

export default Mage;