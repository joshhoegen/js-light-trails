class Particle {
  constructor(point, velocity, acceleration) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
  }

  submitToFields(fields) {
    // our starting acceleration this frame
    let totalAccelerationX = 0;
    let totalAccelerationY = 0;

    // for each passed field
    for (const field of fields) {
      // find the distance between the particle and the field
      const vectorX = field.position.x - this.position.x;
      const vectorY = field.position.y - this.position.y;

      // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
      const force = field.mass / ((vectorX*vectorX + vectorY*vectorY) ** 1.5);

      // add to the total acceleration the force adjusted by distance
      totalAccelerationX += vectorX * force;
      totalAccelerationY += vectorY * force;
    }

    // update our particle's acceleration
    this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
  }

  move() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
}

class Field {
  constructor(point, mass) {
    this.position = point;
    this.setMass(mass);
  }

  setMass(mass) {
    this.mass = mass || 100;
    this.drawColor = mass < 0 ? "#f00" : "#0f0";
  }
}

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getAngle() {
    return Math.atan2(this.y,this.x);
  }

  static fromAngle(angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
}

class Emitter {
  constructor(point, velocity, spread) {
    this.position = point; // Vector
    this.velocity = velocity; // Vector
    this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
    this.drawColor = "#999"; // So we can tell them apart from Fields later
  }

  emitParticle() {
    // Use an angle randomized over the spread so we have more of a "spray"
    const angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

    // The magnitude of the emitter's velocity
    const magnitude = this.velocity.getMagnitude();

    // The emitter's position
    const position = new Vector(this.position.x, this.position.y);

    // New velocity based off of the calculated angle and magnitude
    const velocity = Vector.fromAngle(angle, magnitude);

    // return our new Particle!
    return new Particle(position,velocity);
  }
}

const OutputParticles = class {
  constructor(canvas, ctx) {
    this.maxParticles = 20000; // drawSize of emitter/field
    this.particleSize = 1;
    this.emissionRate = 20;
    this.objectSize = 3;
    this.ctx = ctx;
    this.canvas = canvas;
    // const canvas = document.querySelector('canvas');
    // const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.particles = [];

    const midX = canvas.width / 2;
    const midY = canvas.height / 2;

    // Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
    // that emits at a velocity of `2` shooting out from the right (angle `0`)
    this.emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2), Math.PI)];

    // Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
    // that repels with a force of `140`
    this.fields = [
      new Field(new Vector(midX - 300, midY + 20), 900),
      new Field(new Vector(midX - 200, midY + 10), -50),
    ];
  }

  addNewParticles() {
    // if we're at our max, stop emitting.
    if (this.particles.length > this.maxParticles) return;

    // for each emitter
    for (let i = 0; i < this.emitters.length; i++) {

      // emit [emissionRate] particles and store them in our particles array
      for (let j = 0; j < this.emissionRate; j++) {
        this.particles.push(this.emitters[i].emitParticle());
      }

    }
  }

  plotParticles(boundsX, boundsY) {
    // a new array to hold particles within our bounds
    const currentParticles = [];

    for (const particle of this.particles) {
      const pos = particle.position;

      // If we're out of bounds, drop this particle and move on to the next
      if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

      // Update velocities and accelerations to account for the fields
      particle.submitToFields(this.fields);

      // Move our particles
      particle.move();

      // Add this particle to the list of current particles
      currentParticles.push(particle);
    }

    // Update our global particles reference
    this.particles = currentParticles;
  }

  drawParticles() {
    this.ctx.fillStyle = 'rgb(0,0,255)';
    for (let i = 0; i < this.particles.length; i++) {
      const position = this.particles[i].position;
      this.ctx.fillRect(position.x, position.y, this.particleSize, this.particleSize);
    }
  }

  drawCircle(object) {
    // console.log(this);
    this.ctx.fillStyle = object.drawColor;
    this.ctx.beginPath();
    this.ctx.arc(object.position.x, object.position.y, this.objectSize, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  loop() {
    // this.clear();
    this.update();
    this.draw();
    // this.queue();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.addNewParticles();
    this.plotParticles(this.canvas.width, this.canvas.height);
  }

  draw() {
    this.drawParticles();
    this.fields.forEach(this.drawCircle.bind(this));
    this.emitters.forEach(this.drawCircle.bind(this));
  }

  queue() {
    window.requestAnimationFrame(this.loop.bind(this));
  }
}

// loop();

export default OutputParticles;
