document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const tradeButton = document.getElementById("trade-button");
    const trainingButton = document.getElementById("training-button");
    const contactButton = document.getElementById("contact-button");
    const logoutButton = document.getElementById("logout");
    const welcomeButton = document.getElementById("welcome-button");
    const buyerButton = document.getElementById("buyer-button");
    const sellerButton = document.getElementById("seller-button");
    const sellSeedsButton = document.getElementById("sell-seeds-button");
    const bookTrainingButton = document.getElementById("book-training");
    const trainingDetailsSection = document.getElementById("training-details");

    // Hamburger menu elements
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const mobileNav = document.getElementById("mobile-nav");

    // Mobile nav buttons
    const contactButtonMobile = document.getElementById("contact-button-mobile");
    const tradeButtonMobile = document.getElementById("trade-button-mobile");
    const trainingButtonMobile = document.getElementById("training-button-mobile");
    const logoutMobile = document.getElementById("logout-mobile");

    const currentYearSpan = document.getElementById("current-year");
    currentYearSpan.textContent = new Date().getFullYear();

    // Retrieve the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // If user is logged in, display their name in the profile section
    if (currentUser) {
        const userIcon = document.getElementById("user-icon");
        const userIconMobile = document.getElementById("user-icon-mobile");
        userIcon.textContent = `👤 ${currentUser.full_name}`; // Display user's name in the profile icon
        userIconMobile.textContent = `👤 ${currentUser.full_name}`;
    } else {
        alert("Please log in to continue.");
        window.location.href = '/index.html'; // Redirect to login page if not logged in
    }

    // Hamburger menu functionality
    hamburgerMenu.addEventListener("click", () => {
        mobileNav.classList.toggle("show");
        // Change icon between hamburger and X
        hamburgerMenu.innerHTML = mobileNav.classList.contains("show") ? "&times;" : "&#9776;";
    });

    // Close mobile nav when clicking a link or button
    mobileNav.addEventListener("click", (event) => {
        if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
            mobileNav.classList.remove("show");
            hamburgerMenu.innerHTML = "&#9776;"
        }
    });

    // Theme toggle function for both desktop and mobile
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Toggle trade section
    tradeButton.addEventListener("click", () => {
        document.getElementById("trade-section").style.display = "block";
        document.getElementById("training-section").style.display = "none";
        document.getElementById("contact-form-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Toggle training section
    trainingButton.addEventListener("click", () => {
        document.getElementById("training-section").style.display = "block";
        document.getElementById("trade-section").style.display = "none";
        document.getElementById("contact-form-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Toggle contact form section
    contactButton.addEventListener("click", () => {
        document.getElementById("contact-form-section").style.display = "block";
        document.getElementById("trade-section").style.display = "none";
        document.getElementById("training-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Mobile nav trade section toggle
    tradeButtonMobile.addEventListener("click", () => {
        document.getElementById("trade-section").style.display = "block";
        document.getElementById("training-section").style.display = "none";
        document.getElementById("contact-form-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Mobile nav training section toggle
    trainingButtonMobile.addEventListener("click", () => {
        document.getElementById("training-section").style.display = "block";
        document.getElementById("trade-section").style.display = "none";
        document.getElementById("contact-form-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Mobile nav contact form toggle
    contactButtonMobile.addEventListener("click", () => {
        document.getElementById("contact-form-section").style.display = "block";
        document.getElementById("trade-section").style.display = "none";
        document.getElementById("training-section").style.display = "none";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Welcome button to show trade section
    welcomeButton.addEventListener("click", () => {
        document.getElementById("trade-section").style.display = "block";
        document.getElementById("introduction").style.display = "none"; 
    });

    // Show buyer section
    buyerButton.addEventListener("click", () => {
        document.getElementById("buyer-section").style.display = "block";
        document.getElementById("seller-section").style.display = "none";
        document.getElementById("sell-seeds-section").style.display = "none";
    });

    // Show seller section
    sellerButton.addEventListener("click", () => {
        document.getElementById("seller-section").style.display = "block";
        document.getElementById("buyer-section").style.display = "none";
        document.getElementById("sell-seeds-section").style.display = "none";
    });

    // Show sell seeds section
    sellSeedsButton.addEventListener("click", () => {
        document.getElementById("sell-seeds-section").style.display = "block";
        document.getElementById("buyer-section").style.display = "none";
        document.getElementById("seller-section").style.display = "none";
    });

    // Book training button functionality
    bookTrainingButton.addEventListener("click", () => {
        trainingDetailsSection.style.display = trainingDetailsSection.style.display === "none" ? "block" : "none";
    });

    // Handle training form submission
    document.getElementById("training-form").addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const trainingType = document.getElementById("training-type").value;
        const trainingTime = document.getElementById("training-time").value;

        try {
            const response = await fetch('http://localhost:3000/api/book-training', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: currentUser.email,
                    trainingType: trainingType,
                    trainingTime: trainingTime,
                }),
            });

            const data = await response.json();
            alert(data.message || "Training booked successfully!"); 
            document.getElementById("training-confirmation").innerHTML = `<p>Training booked for ${trainingType} at ${trainingTime}.</p>`;
            trainingDetailsSection.style.display = "none"; 
        } catch (error) {
            console.error('Error:', error);
            alert('Error booking training.'); 
        }
    });

    // Calculate total price for buying potatoes
    document.getElementById("buy-potato-form").addEventListener("input", (event) => {
        const quantity = document.getElementById("buy-quantity").value;
        const selectedOption = document.getElementById("potato-type").selectedOptions[0];
        const pricePerBag = parseInt(selectedOption.text.split(" - Ksh ")[1], 10);
        const totalPrice = pricePerBag * quantity;
        document.getElementById("total-price").textContent = `Ksh ${totalPrice}`;
    });

    // Handle potato purchase form submission
    document.getElementById("buy-potato-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const potatoType = document.getElementById("potato-type").value;
        const quantity = document.getElementById("buy-quantity").value;
        const totalPrice = document.getElementById("total-price").textContent;

        try {
            const response = await fetch('http://localhost:3000/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: currentUser.email,
                    potatoType: potatoType,
                    quantity: quantity,
                    totalPrice: parseFloat(totalPrice.split(" ")[1]) // Convert "Ksh X" to X
                }),
            });

            const data = await response.json();
            document.getElementById("buy-receipt").innerHTML = `<p>You bought ${quantity} bags of ${potatoType} for ${totalPrice}</p>`;
            alert(data.message); 
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing purchase.');
        }
    });

    // Handle potato sell form submission
    document.getElementById("sell-potato-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const potatoType = document.getElementById("sell-type").value;
        const quantity = document.getElementById("sell-quantity").value;

        try {
            const response = await fetch('http://localhost:3000/api/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: currentUser.email,
                    potatoType: potatoType,
                    quantity: quantity,
                }),
            });

            const data = await response.json();
            document.getElementById("sell-receipt").innerHTML = `<p>You sold ${quantity} kg of ${potatoType} potatoes</p>`;
            alert(data.message); // Notify the user of success
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing sale.');
        }
    });

    // Handle sell seeds form submission
    document.getElementById("sell-seeds-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const seedType = document.getElementById("seed-type").value;
        const quantity = document.getElementById("sell-seeds-quantity").value;
        const pricePerSeed = 3000; 
        const totalPrice = quantity * pricePerSeed;

        try {
            const response = await fetch('http://localhost:3000/api/sell-seeds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: currentUser.email,
                    seedType: seedType,
                    quantity: quantity,
                    totalPrice: totalPrice,
                }),
            });

            const data = await response.json();
            document.getElementById("sell-seeds-receipt").innerHTML = `<p>You sold ${quantity} kg of ${seedType} seeds for Ksh ${totalPrice}</p>`;
            alert(data.message); // Notify the user of success
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing seed sale.');
        }
    });

    // Fetch sales data and create chart
    const createSalesChart = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/sales-data');
            const data = await response.json();

            const labels = data.map(item => item.potatoType);
            const quantities = data.map(item => item.quantity);

            const ctx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sales Quantity',
                        data: quantities,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    createSalesChart(); 

    // Logout button functionality
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem('currentUser'); 
        window.location.href = '/index.html'; 
    });

    // Logout functionality for mobile nav
    logoutMobile.addEventListener("click", () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    });
});
