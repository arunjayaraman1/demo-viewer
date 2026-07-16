document.addEventListener('DOMContentLoaded', () => {
  const accessForm = document.getElementById('access-form');
  const accessCodeInput = document.getElementById('access-code');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const accessCard = document.getElementById('access-card');

  // Case-insensitive mapping of access codes to demo folder files
  const codeMapping = {
    'ARUN123': '/demos/walkthroughs/mvp-walkthrough.html',
    'DECK001': '/demos/deck/assurance-deck.html',
    'CLIENTA': '/demos/product/platform-mockup.html',
    'VISIONA': '/demos/walkthroughs/vision-walkthrough.html',
    'REPORTA': '/demos/walkthroughs/pfa-playwright-report.html'
  };

  // Event handler for form submission
  accessForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const enteredCode = accessCodeInput.value.trim().toUpperCase();
    
    // Clear previous error state
    errorMessage.classList.remove('visible');
    accessCard.classList.remove('shake');
    accessCard.classList.remove('success-state');

    if (!enteredCode) {
      showError('Please enter an access code.');
      triggerShake();
      return;
    }

    // Set loading state for button
    submitBtn.classList.add('loading');
    accessCodeInput.disabled = true;

    // Simulate backend validation delay (adds a secure & premium feel)
    await new Promise(resolve => setTimeout(resolve, 800));

    if (enteredCode in codeMapping) {
      // Success path
      accessCard.classList.add('success-state');
      
      // Delay redirect to allow success transition animation to complete
      setTimeout(() => {
        window.location.href = codeMapping[enteredCode];
      }, 600);
    } else {
      // Error path
      accessCodeInput.disabled = false;
      submitBtn.classList.remove('loading');
      
      showError('Invalid access code. Please try again.');
      triggerShake();
      
      // Re-focus and select code for easy re-entry
      accessCodeInput.focus();
      accessCodeInput.select();
    }
  });

  // Helper to show error message
  function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.add('visible');
  }

  // Helper to trigger card shake animation
  function triggerShake() {
    accessCard.classList.add('shake');
    // Remove class after animation finishes (500ms) to allow re-triggering
    setTimeout(() => {
      accessCard.classList.remove('shake');
    }, 500);
  }
});
