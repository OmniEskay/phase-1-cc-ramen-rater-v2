// index.js

const baseURL = "http://localhost:3000";

// --- DOM Elements ---
const ramenMenuDiv = document.getElementById('ramen-menu');
const detailImage = document.getElementById('detail-image');
const detailName = document.getElementById('detail-name');
const detailRestaurant = document.getElementById('detail-restaurant');
const detailRating = document.getElementById('detail-rating');
const detailComment = document.getElementById('detail-comment');
const newRamenForm = document.getElementById('new-ramen');

// --- Core Functions ---

/**
 * Fetches all ramen data and displays their images in the menu.
 */
function displayRamens() {
    fetch(`${baseURL}/ramens`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(ramens => {
            ramenMenuDiv.innerHTML = ''; // Clear previous content
            ramens.forEach(ramen => {
                const img = document.createElement('img');
                img.src = ramen.image;
                img.alt = ramen.name; // Good practice for accessibility
                img.dataset.id = ramen.id; // Store id for click handling
                img.classList.add('ramen-avatar'); // Optional: for styling

                // Add click listener to each image
                img.addEventListener('click', handleClick);

                ramenMenuDiv.appendChild(img);
            });

            // --- Advanced Deliverable: Show first ramen details on load ---
            // if (ramens.length > 0) {
            //     renderDetail(ramens[0]); // Display details of the first ramen
            // }
            // --- End Advanced ---

        })
        .catch(error => {
            console.error("Error fetching ramens:", error);
            ramenMenuDiv.innerHTML = '<p>Failed to load ramen menu. Is the server running?</p>';
        });
}

/**
 * Handles clicking on a ramen image in the menu.
 * Fetches details for the clicked ramen and displays them.
 * @param {Event} event - The click event object
 */
function handleClick(event) {
    const ramenId = event.target.dataset.id;
    if (!ramenId) {
        console.error("Clicked image is missing a data-id attribute.");
        return;
    }

    fetch(`${baseURL}/ramens/${ramenId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(ramen => {
            renderDetail(ramen);
        })
        .catch(error => {
            console.error(`Error fetching ramen details for ID ${ramenId}:`, error);
            // Optionally update the detail section with an error message
            detailName.textContent = "Error loading details";
            detailRestaurant.textContent = "";
            detailRating.textContent = "";
            detailComment.textContent = "";
            detailImage.src = "placeholder.jpg"; // Or some error image
        });
}

/**
 * Updates the #ramen-detail section with the provided ramen's info.
 * @param {object} ramen - The ramen object with details (id, name, restaurant, image, rating, comment)
 */
function renderDetail(ramen) {
    if (!ramen) {
        console.error("renderDetail called with invalid ramen data", ramen);
        return;
    }
    detailImage.src = ramen.image;
    detailImage.alt = `Image of ${ramen.name}`;
    detailName.textContent = ramen.name;
    detailRestaurant.textContent = ramen.restaurant;
    detailRating.textContent = ramen.rating;
    detailComment.textContent = ramen.comment;

    // --- Advanced/Extra Advanced: Store current ID for potential updates/deletes ---
    // detailImage.dataset.currentId = ramen.id; // Store ID on an element for reference
    // --- End Advanced ---
}

/**
 * Adds the submit event listener to the new ramen form.
 */
function addSubmitListener() {
    newRamenForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Handles the submission of the new-ramen form.
 * Creates a new ramen object (locally) and adds its image to the menu.
 * @param {Event} event - The submit event object
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default page reload

    // Get values from the form
    const newRamen = {
        name: event.target['new-name'].value,
        restaurant: event.target['new-restaurant'].value,
        image: event.target['new-image'].value,
        rating: event.target['new-rating'].value,
        comment: event.target['new-comment'].value,
        // Note: No 'id' is needed for the core deliverable as it's not persisted.
        // For Extra Advanced (POST), you'd send this data (without id) to the server
        // and use the server-generated id in the response.
    };

    // Add the new ramen's image to the menu (doesn't need persistence)
    addNewRamenToMenu(newRamen);

    // Reset the form fields
    event.target.reset();
}

/**
 * Creates an image element for a new ramen and adds it to the menu.
 * Note: For the core deliverable, this new image won't have a working
 * click handler to show details unless you fetch ALL ramens again or
 * assign a temporary ID and make handleClick robust enough.
 * @param {object} ramenData - Object containing at least `image` and `name` properties.
 */
function addNewRamenToMenu(ramenData) {
    const img = document.createElement('img');
    img.src = ramenData.image;
    img.alt = ramenData.name;
    img.classList.add('ramen-avatar'); // Optional styling

    // --- Option 1: Core Deliverable - Add image without details functionality ---
    // (No data-id or event listener added here)

    // --- Option 2: Attempt to make it clickable (Needs careful handling in handleClick) ---
    // img.dataset.id = `temp-${Date.now()}`; // Assign a temporary, non-persistent ID
    // img.addEventListener('click', () => {
    //     // Special handling for non-persisted items:
    //     // Just display the data we already have, don't fetch
    //     renderDetail({ ...ramenData, id: img.dataset.id }); // Pass the temporary data
    // });
    // For simplicity with Core Deliverables, let's stick to Option 1 implicitly
    // by not adding the listener or ID here. If a user clicks it, nothing will happen.

    ramenMenuDiv.appendChild(img);
}


// --- Main Function and Initialization ---

/**
 * Main function to initialize the application logic.
 */
function main() {
    displayRamens();
    addSubmitListener();
    // Add other initializations here if needed
}

// --- Wait for the DOM to be fully loaded before running the main script ---
document.addEventListener('DOMContentLoaded', main);