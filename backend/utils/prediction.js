/**
 * AI Stock Prediction Utility
 * Uses simple linear regression to predict days until stock exhaustion.
 */

const predictStockExhaustion = (stockLogs) => {
  // stockLogs: [{ timestamp, stockLevel }]
  if (stockLogs.length < 2) return null;

  const n = stockLogs.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  stockLogs.forEach((log, i) => {
    const x = i; // Time index
    const y = log.stockLevel;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (slope >= 0) return Infinity; // Stock is increasing or stable

  const daysRemaining = -stockLogs[n - 1].stockLevel / slope;
  return Math.round(daysRemaining * 10) / 10;
};

module.exports = { predictStockExhaustion };
