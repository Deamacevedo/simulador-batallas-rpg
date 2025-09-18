import Character from './Character.js';

/**
 * Arquero - Especializado en velocidad y ataques precisos
 * (SOLID - LSP: Liskov Substitution - puede usarse como Character)
 */
class Archer extends Character {
    constructor(name) {
        super(name, 'Arquero');
        
        // Bonificaciones específicas del arquero
        this.maxHealth = 90;   // Vida media
        this.health = 90;
        this.attack = 22;      // Buen ataque
        this.defense = 12;     // Defensa media
        this.speed = 18;       // Muy rápido
        this.maxMana = 60;     // Maná medio
        this.mana = 60;
    }

    // Habilidad especial: Flecha Múltiple
    specialAttack(target) {
        if (this.mana < 18) {
            return null; // No tiene suficiente maná
        }
        
        this.mana -= 18;
        // Múltiples flechas con daño menor cada una
        const arrowCount = 3;
        const damagePerArrow = Math.floor(this.attack * 0.7);
        const totalDamage = damagePerArrow * arrowCount;
        
        target.takeDamage(totalDamage);
        
        return {
            name: 'Flecha Múltiple',
            damage: totalDamage,
            arrows: arrowCount,
            description: `${this.name} dispara ${arrowCount} flechas rápidas!`
        };
    }

    // Habilidad especial: Disparo Certero (crítico)
    criticalShot(target) {
        if (this.mana < 12) {
            return null;
        }
        
        this.mana -= 12;
        const damage = Math.floor(this.attack * 1.6); // 60% más daño
        target.takeDamage(damage);
        
        return {
            name: 'Disparo Certero',
            damage: damage,
            critical: true,
            description: `${this.name} apunta cuidadosamente y dispara un tiro crítico!`
        };
    }

    // Habilidad pasiva: Esquivar
    takeDamage(damage) {
        // 20% de probabilidad de esquivar completamente
        if (Math.random() < 0.2) {
            return {
                dodged: true,
                damage: 0,
                message: `${this.name} esquiva ágilmente el ataque!`
            };
        }
        
        super.takeDamage(damage);
        return { dodged: false, damage };
    }

    // Información específica del arquero
    getSpecialInfo() {
        return `🏹 Arquero especializado en ataques a distancia
        - Flecha Múltiple: 3 flechas rápidas (Costo: 18 maná)
        - Disparo Certero: Tiro crítico preciso (Costo: 12 maná)
        - Esquivar: 20% probabilidad de evitar daño
        - Alta velocidad y precisión, defensa media`;
    }
}

export default Archer;