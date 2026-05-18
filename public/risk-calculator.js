document.addEventListener('DOMContentLoaded', () => {
  const capitalInput = document.getElementById('capital');
  const stakeDisplay = document.getElementById('stake');
  const takeProfitDisplay = document.getElementById('takeProfit');
  const stopLossDisplay = document.getElementById('stopLoss');

  if (!capitalInput || !stakeDisplay || !takeProfitDisplay || !stopLossDisplay) {
    console.error('❌ Calculator elements not found in the DOM');
    return;
  }

  // Update results whenever input changes
  capitalInput.addEventListener('input', calculateResults);

  function calculateResults() {
    const capital = parseFloat(capitalInput.value) || 0;

    if (capital <= 0) {
      updateDisplays('0.00', '0.00', '0.00');
      return;
    }

    // Stake = 2% of capital
    const initialStake = (capital * 0.02).toFixed(2);

    // Take Profit = 5x stake
    const takeProfit = (initialStake * 5).toFixed(2);

    // Stop Loss = sum of 4 consecutive martingale losses
    let stopLoss = 0;
    let currentStake = parseFloat(initialStake);
    for (let i = 0; i < 4; i++) {
      stopLoss += currentStake;
      currentStake *= 2;
    }

    updateDisplays(initialStake, takeProfit, stopLoss.toFixed(2));
  }

  function updateDisplays(stake, takeProfit, stopLoss) {
    stakeDisplay.textContent = stake;
    takeProfitDisplay.textContent = takeProfit;
    stopLossDisplay.textContent = stopLoss;
  }

  // Initialize with default values
  calculateResults();
});

