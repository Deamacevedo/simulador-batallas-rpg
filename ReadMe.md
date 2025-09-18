# Taller - Simulador de Batallas RPG por Consola (Node.js)

---

### Objetivo General

Desarrollar una **aplicación de consola interactiva** que simule batallas entre personajes con distintas clases (guerrero, mago, arquero, etc.), aplicando programación orientada a objetos, principios SOLID, diseño limpio, trabajo en equipo y publicación en GitHub.

---

### Requisitos Generales

- Lenguaje: **JavaScript con Node.js**
- Librerías permitidas: cualquier paquete `npm` útil (ej. `inquirer`, `chalk`, `uuid`, etc.)
- Aplicación con **interfaz por consola (menú funcional)**.
- Aplicar **los 5 principios SOLID**.
- Uso de **Programación Orientada a Objetos**:
    - Herencia
    - Polimorfismo
    - Encapsulamiento
    - Relaciones entre clases

---

### Funcionalidades mínimas que debe tener la app

### Gestión de personajes

- Crear personajes de diferentes clases (ej. Guerrero, Mago, Arquero).
- Cada clase debe tener atributos y habilidades distintas.
- Los personajes pueden subir de nivel y mejorar sus estadísticas.

### Sistema de batallas

- Simular batallas por turnos entre personajes.
- Aplicar habilidades especiales con efectos distintos.
- Mostrar los resultados por consola.

### Inventario y objetos

- Manejar objetos de batalla: armas, pociones, armaduras.
- Los objetos deben modificar el comportamiento o atributos del personaje.
- Deben poder añadirse, usarse y eliminarse del inventario.

### Enemigos controlados por IA

- Crear enemigos aleatorios.
- El sistema debe controlar su ataque en cada turno.

### Guardar y cargar progreso

- Opcional: permitir guardar personajes en archivos JSON o base de datos local (`lowdb`, `fs`, etc.).

### Menú funcional por consola

- Usar `inquirer` para presentar opciones y capturar decisiones del usuario:
    - Crear personaje
    - Ver personajes
    - Iniciar batalla
    - Salir

---

### Aspectos técnicos obligatorios

### Aplicar los 5 principios SOLID

- **SRP**: cada clase debe tener una única responsabilidad (ej. `Batalla`, `GestorInventario`, `Notificador`, etc.).
- **OCP**: permitir añadir nuevas clases de personaje sin modificar las existentes.
- **LSP**: todos los personajes deben poder usarse como instancias de una clase base `Personaje`.
- **ISP**: separar interfaces como `IAtaque`, `ICurable`, `IUsaMagia` para no forzar métodos innecesarios.
- **DIP**: clases como `GestorBatalla` deben depender de abstracciones (`IAtaque`, `INotificador`) y no de implementaciones concretas.

### Programación orientada a objetos

- Usar herencia (`extends`), métodos sobrescritos, encapsulamiento (`#propiedades`, métodos públicos), y relaciones (composición, agregación).

### Diagrama de clases

- Deben entregar el diseño en un **diagrama UML** donde se visualicen clases, atributos, métodos y relaciones.

### Organización del proyecto

- Código dividido en carpetas, por ejemplo:
    - `src/` (código fuente)
    - `services/` (clases de lógica)
    - `models/` (entidades)
    - `utils/` (funciones auxiliares)
    - `data/` (archivos JSON si se guarda el juego)
- Código documentado y limpio.

---

### Entregables

1. **Repositorio GitHub** con el código completo y documentado.
2. **Diagrama de clases UML** (PDF o imagen) incluido en el README.
3. **Video explicativo** dividido en 3 partes:
    - Parte 1: Explicación del diagrama de clases
    - Parte 2: Organización del código y aplicación de SOLID
    - Parte 3: Demostración de la aplicación en ejecución
    - Todos los integrantes deben aparecer y participar.

---

### Reglas de trabajo en equipo

- Grupos de **máximo 3 estudiantes**.
- Deben mostrar en el video que **todos participaron activamente**.
- La participación será evaluada individual y grupalmente.

---

### Sugerencias de librerías útiles

- [`inquirer`](https://www.npmjs.com/package/inquirer): para menús de consola
- [`chalk`](https://www.npmjs.com/package/chalk): para dar color a los textos
- [`uuid`](https://www.npmjs.com/package/uuid): para generar IDs únicos

---

## Entrega

**Plazo máximo: Jueves** 18 de septiembre de 2025 a las 11:59 p.m.