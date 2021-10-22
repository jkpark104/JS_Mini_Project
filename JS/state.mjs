let score = 0;

let round = 1;

const getState = () => ({ score, round });

const setState = ({ score: newScore, round: newRound }) => {
  score = newScore ?? score;
  round = newRound ?? round;
};

export { getState, setState };
