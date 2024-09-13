// Define the keys to save the scroll positions in localStorage
const LATEST_POSITION_KEY = 'scrollPositionSaver_latest';
const PREVIOUS_POSITION_KEY = 'scrollPositionSaver_previous';

// Get the scrollable div element
function getScrollableDiv() {
  const parentDiv = document.querySelector('[class*="react-scroll-to-bottom--css-"]');
  if (parentDiv) {
    // Select the immediate child div of the parent
    return parentDiv.querySelector('div'); // Adjust if it's not the direct child but a deeper child
  }
  return null;
}

// Save the current and previous scroll positions dynamically
function saveCurrentPosition() {
  const scrollableDiv = getScrollableDiv();
  if (scrollableDiv) {
    const currentPosition = scrollableDiv.scrollTop;
    const previousPosition = parseInt(localStorage.getItem(LATEST_POSITION_KEY), 10);

    // Update the previous position before saving the latest position
    if (!isNaN(previousPosition)) {
      localStorage.setItem(PREVIOUS_POSITION_KEY, previousPosition);
    }
    localStorage.setItem(LATEST_POSITION_KEY, currentPosition);

    console.log("Scroll positions updated. Latest:", currentPosition, "Previous:", previousPosition);
  } else {
    console.log("Scrollable div not found.");
  }
}

let scrollTimeout = null;

// Save the current and previous scroll positions only after scrolling stops for 1 second
function handleScroll() {
  // Clear the previous timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Set a new timeout to save the scroll position after 1 second of no scrolling
  scrollTimeout = setTimeout(() => {
    saveCurrentPosition(); // Save the latest and previous positions
  }, 600); // 1 second delay after scrolling stops
}

// Update the scroll position dynamically when the user scrolls
document.addEventListener('scroll', handleScroll, true);


// Scroll to the previous saved position (undo)
function positionUndo() {
  const scrollableDiv = getScrollableDiv();
  const previousPosition = parseInt(localStorage.getItem(PREVIOUS_POSITION_KEY), 10);
  // const latestPositionOld = parseInt(localStorage.getItem(LATEST_POSITION_KEY), 10);

  if (scrollableDiv && !isNaN(previousPosition)) {
    // Swap latest and previous positions for undo effect
    const latestPositionNew = scrollableDiv.scrollTop;
    // localStorage.setItem(LATEST_POSITION_KEY, latestPositionNew);
    // localStorage.setItem(PREVIOUS_POSITION_KEY, latestPositionOld);

    scrollableDiv.scrollTop = previousPosition;
    console.log("Position Undo triggered: To:", previousPosition);
  } else {
    console.log("No previous position saved or scrollable div not found.");
  }
}

// Clear the saved scroll positions when the page reloads
window.addEventListener('beforeunload', () => {
  localStorage.removeItem(LATEST_POSITION_KEY);
  localStorage.removeItem(PREVIOUS_POSITION_KEY);
  console.log("Scroll positions cleared from localStorage.");
});

// Listen for key presses to undo (Ctrl+Z) or redo (Ctrl+Y) the scroll position
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    positionUndo(); // Undo: Go to the previous scroll position
  }
});


