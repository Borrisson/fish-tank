class SwitchFish extends Fish {
  constructor(options) {
    super(options);
    this.name = 'SwitchFish';
  }

  onClick(event) {
    super.onClick()
    this.makeNewVelocity(50);
  }
}
