exports.scoringLogic = (scoringEvent) => {
  switch (scoringEvent) {
    case 'VF':
      return 2;
    case 'VA':
      return 0;
    case 'CW':
      return 10;
    case 'IW':
      return 15;
    case 'IF':
      return 20;
    case 'EL':
      return -10;
    case 'TC':
      return 5;
    case 'FM':
      return 20;
    case 'Thrd':
      return 25;
    case 'Scnd':
      return 35;
    case 'Frst':
      return 50;
    default:
      return 0;
  }
};
