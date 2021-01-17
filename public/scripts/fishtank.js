class Fishtank {
  constructor(divName) {
    this.divName = divName;
    this.denizens = {};
    this.specieses = {};
    this.drawing = true;
    this.drawGraphicsBound = this.drawGraphics.bind(this);    // ahahaha, welcome to `this` hell.  callback hell never had it so fiery.
    requestAnimationFrame(this.drawGraphicsBound);
  }

  registerSpecies() {
    for (var species of arguments) {
      this.specieses[species.name] = species;
    }
  }

  getRandomSpecies() {
    var specieses = Object.values(this.specieses);
    var index = randRangeInt(specieses.length - 1);
    return specieses[index];
  }

  registerDenizen(individual) {
    var id;
    while (!id || this.denizens[id]) {
      id = Math.floor(Math.random() * 1000) + '';
    }
    this.denizens[id] = individual;
    return id;
  }

  getProximateDenizens(center, radius) {
    function isNearCenter(individual) {
      return individual.position.distance(center) <= radius;
      //return distance(individual.position, center) <= radius;
    }
    return Object.values(this.denizens).filter(isNearCenter);
  }

  removeDenizen(id, duration) {
    delete (this.denizens[id]);
    duration = duration || 1;
    duration = Number(duration) + 's';
    var $victim = $('#' + id);
    $victim.off();
    $victim.css({ transition: 'all ' + duration });
    $victim.css({
      opacity: '0',
      width: $victim.width() * 3,
      height: $victim.height() * 3,
    });
    setTimeout(() => $victim.remove(), 3000);
  }

  runPhysics(time) {
    if (!time) {
      time = new Date();
    }
    for (var id in this.denizens) {
      if (this.denizens[id] && this.denizens[id].update) {
        this.denizens[id].update(time);
      }
    }
      // checks if two fish are at the same location. if true it calls eatable() from fish.js file if tasty then kill. Does not scale if too many fishes.
      for (var [id, { name, position: { x, y } }] of Object.entries(this.denizens)) {
        //found the error. As we add WAY more fishes. List of this.denizens gets HUGE. therefor, first loop stays on id for a WHILE, even though it has been removed.
      for (let [key, { name: secName, position: { x: a, y: b } }] of Object.entries(this.denizens)) {
        if (id !== key
          && name !== 'Seed'
          && name !== 'Starter'
          && secName !== 'Seed'
          && secName !== 'Starter'
          && name !== secName
          && Math.abs(a - x) <= 10
          && Math.abs(b - y) <= 10)
          {
            try {
          this.denizens[id].eatable();
          this.denizens[key].eatable();
            } catch(e) {
              console.log(e, 'id', this.denizens[id], 'key', this.denizens[key]);
              continue;
            }
        }
      }
    }
  }
  pause(doPause) {
    this.drawing = !doPause;
    if (this.drawing) {
      this.drawGraphics();
    }
  }

  unpause() {
    this.pause(false);
  }

  drawGraphics() {
    this.runPhysics();  // TODO: maybe this should be on a separate setInterval
    var $fishtank = $('#' + this.divName);
    var centerX = Math.floor(window.innerWidth / 2);
    var floorY = Math.floor(window.innerHeight * 0.95);
    for (var id in this.denizens) {
      var denizen = this.denizens[id];
      var renderRules = denizen.renderRules();
      var $denizen = $('#' + id);
      if ($denizen.length === 0) {
        $denizen = $(`<img id="${id}"></img>`);
        $denizen.css({ position: 'fixed' });
        $denizen.click(denizen.onClick);
        $fishtank.append($denizen);
      }

      if ($denizen.attr('src') !== renderRules.imageUri) {
        $denizen.attr('src', renderRules.imageUri);
      }

      if (renderRules.x !== undefined) {
        $denizen.css('left', renderRules.x + centerX);
      }
      if (renderRules.y !== undefined) {
        $denizen.css('bottom', renderRules.y + 10);
      }
      $denizen.css(renderRules.css);    // this is allowed to override the previous, if the Denizen wants to
    }

    if (this.drawing) {
      requestAnimationFrame(this.drawGraphicsBound);
    }
  }

  getBounds() {
    return {
      minX: - window.innerWidth / 2,
      maxX: window.innerWidth / 2,
      minY: -10,
      maxY: window.innerHeight - 10,
    };
  }

}

