import { v4 as uuid } from 'uuid';

/**
 * Clase base para todos los personajes (SOLID - SRP: Single Responsibility)
 * Solo se encarga de las propiedades básicas de un personaje
 */
class Character {
    constructor(name, type) {
        this.id = uuid();
        this.name = name;
        this.type = type;
        this.level = 1;
        
        // Estadísticas básicas - súper simple!
        this.maxHealth = 100;
        this.health = 100;
        this.attack = 20;
        this.defense = 10;
        this.speed = 10;
        this.mana = 50;
        this.maxMana = 50;
        
        // Experiencia
        this.exp = 0;
        this.expToNext = 100;
    }

    // Método para atacar - básico
    basicAttack(target) {
        const damage = Math.max(1, this.attack - target.defense);
        target.takeDamage(damage);
        return damage;
    }

    // Recibir daño
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }

    // Curar
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    // Verificar si está vivo
    isAlive() {
        return this.health > 0;
    }

    // Subir de nivel - simple y efectivo
    levelUp() {
        this.level++;
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attack += 5;
        this.defense += 3;
        this.speed += 2;
        this.maxMana += 10;
        this.mana = this.maxMana;
        this.exp = 0;
        this.expToNext = this.level * 100;
    }

    // Ganar experiencia
    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNext) {
            this.levelUp();
            return true; // Subió de nivel
        }
        return false;
    }

    // Método abstracto para habilidad especial (Polimorfismo)
    specialAttack(target) {
        throw new Error('Cada clase debe implementar su propia habilidad especial');
    }

    // Información del personaje para mostrar
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            attack: this.attack,
            defense: this.defense,
            speed: this.speed,
            mana: this.mana,
            maxMana: this.maxMana,
            exp: this.exp,
            expToNext: this.expToNext
        };
    }
}

export default Character;