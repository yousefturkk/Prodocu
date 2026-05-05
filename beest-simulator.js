/**
 * BEEST Simulator - Mechanical animal simulation
 * Prototype for mechanical creature behavior
 */

class BEESTSimulator {
  constructor() {
    this.legs = [];
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.energy = 100;
  }

  addLeg(length, angle) {
    this.legs.push({ length, angle, position: 0 });
  }

  update(deltaTime) {
    // Simulate mechanical movement
    this.legs.forEach((leg, index) => {
      leg.position = Math.sin(Date.now() / 1000 + index) * leg.length;
    });

    // Update position based on leg movement
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Energy consumption
    this.energy -= 0.1 * deltaTime;
    if (this.energy < 0) this.energy = 0;
  }

  move(direction) {
    const speed = 0.5;
    switch(direction) {
      case 'forward':
        this.velocity.y = speed;
        break;
      case 'backward':
        this.velocity.y = -speed;
        break;
      case 'left':
        this.velocity.x = -speed;
        break;
      case 'right':
        this.velocity.x = speed;
        break;
    }
  }

  stop() {
    this.velocity = { x: 0, y: 0 };
  }

  getState() {
    return {
      position: this.position,
      legs: this.legs,
      energy: this.energy
    };
  }
}

// Demo
const simulator = new BEESTSimulator();
simulator.addLeg(10, 0);
simulator.addLeg(10, 90);
simulator.addLeg(10, 180);
simulator.addLeg(10, 270);

console.log('BEEST Simulator initialized');
console.log(simulator.getState());
