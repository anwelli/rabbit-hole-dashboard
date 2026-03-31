export function showLoading(spinnerId, show) {
  const spinner = document.getElementById(spinnerId);
  if (spinner) spinner.style.display = show ? 'block' : 'none';
}

export function showError(errorId, message) {
  const errorDiv = document.getElementById(errorId);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}

export function hideError(errorId) {
  const errorDiv = document.getElementById(errorId);
  if (errorDiv) errorDiv.style.display = 'none';
}