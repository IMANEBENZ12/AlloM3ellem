import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const HandymanRecommender = ({ userZip, jobType, handymen }) => {
  const [topMatches, setTopMatches] = useState([]);

  const jobTypeMap = {
    electrical: 0,
    plumbing: 1,
    cleaning: 2,
    carpentry: 3,
    general: 4,
    'air conditioning': 5,
    'smart home': 6,
    masonry: 7,
    tiling: 8,
    heating: 9,
  };

  const encodeHandyman = (handyman) => {
    const skillMatch = handyman.skills.includes(jobType) ? 1 : 0;
    const zipMatch = handyman.zipCodes.includes(userZip) ? 1 : 0;
    const rating = handyman.rating || 0;
    const experience = handyman.experience || 1; // Default if not provided
    return [skillMatch, zipMatch, rating, experience];
  };

  useEffect(() => {
    const runModel = async () => {
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [4], units: 6, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1 }));

      model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

      // Fake training data
      const xTrain = tf.tensor2d([
        [1, 1, 4.8, 10],
        [1, 0, 4.5, 6],
        [0, 1, 4.9, 12],
        [0, 0, 4.3, 5],
      ]);
      const yTrain = tf.tensor2d([[0.95], [0.75], [0.9], [0.6]]);

      await model.fit(xTrain, yTrain, { epochs: 50 });

      const scores = handymen.map(h => ({
        ...h,
        score: model.predict(tf.tensor2d([encodeHandyman(h)])).dataSync()[0],
      }));

      const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 5);
      setTopMatches(sorted);
    };

    if (handymen.length > 0 && jobType && userZip) {
      runModel();
    }
  }, [userZip, jobType, handymen]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Recommended Handymen:</h3>
      {topMatches.map((h, idx) => (
        <div key={idx} className="border rounded p-3 mb-2 shadow">
          <p><strong>{h.name}</strong> ({h.city})</p>
          <p>{h.bio}</p>
          <p>Rating: {h.rating} ⭐ | Experience: {h.experience} yrs</p>
          <p className="text-green-600 font-semibold">Match Score: {h.score.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default HandymanRecommender;
