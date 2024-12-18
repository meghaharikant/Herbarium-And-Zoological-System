function showHide(type) {
    document.getElementById('plants-add').style.display = type === 'add-plants' ? 'block' : 'none';
    document.getElementById('plants-delete').style.display = type === 'delete-plants' ? 'block' : 'none';
    document.getElementById('plants-update').style.display = type === 'update-plants' ? 'block' : 'none';
    document.getElementById('animals-add').style.display = type === 'add-animals' ? 'block' : 'none';
    document.getElementById('animals-delete').style.display = type === 'delete-animals' ? 'block' : 'none';
    document.getElementById('animals-update').style.display = type === 'update-animals' ? 'block' : 'none';
}

function showSearch(type) {
    document.getElementById('plants-search').style.display = type === 'plants' ? 'block' : 'none';
    document.getElementById('animals-search').style.display = type === 'animals' ? 'block' : 'none';
}

function searchPlants() {
    const query = document.getElementById('plants-search-bar').value.toLowerCase();
    const results = document.getElementById('plants-search-results');
    results.innerHTML = '';

    fetch(`/search_plants/${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(plant => {
                    const div = document.createElement('div');
                    div.classList.add('species-item');

                    // Create and append the text container
                    const textContainer = document.createElement('div');
                    textContainer.classList.add('text-container');

                    textContainer.innerHTML = `
                        <p><strong>Scientific Name:</strong> <em>${plant.Scientific_Name}</em></p>
                        <p><strong>Common Name:</strong> ${plant.Common_Name}</p>
                        <p><strong>Genus:</strong> ${plant.Genus}</p>
                        <p><strong>Family:</strong> ${plant.Family}</p><br>

                        <p><strong>Description:</strong></p>
                        <p>${plant.Description}</p><br>

                        <p><strong>Habitat:</strong> ${plant.Habitat}</p><br>

                        <p><strong>Lifespan:</strong> ${plant.Lifespan}</p><br>

                        <p><strong>Varieties:</strong> ${plant.Varieties}</p><br>

                        <p><strong>Uses:</strong> ${plant.Uses}</p><br>

                        <p><strong>Availability:</strong> ${plant.Availability}</p>
                    `;

                    div.appendChild(textContainer);

                    // Create and append the image
                    const img = document.createElement('img');
                    img.src = plant.Image_link;
                    img.alt = plant.Scientific_Name;
                    img.title = plant.Common_Name;
                    img.classList.add('species-image');
                    div.appendChild(img);
    

                    results.appendChild(div);
                });
            } else {
                const noMatch = document.createElement('div');
                noMatch.textContent = 'No information available for this plant.';
                results.appendChild(noMatch);
            }
        })

        .catch(error => {
            console.error('Error:', error);
            const noMatch = document.createElement('div');
            noMatch.textContent = 'Error fetching plant information.';
            results.appendChild(noMatch);
        });
}

function searchAnimals() {
    const query = document.getElementById('animals-search-bar').value.toLowerCase();
    const results = document.getElementById('animals-search-results');
    results.innerHTML = '';

    fetch(`/search_animals/${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(animal => {
                    const div = document.createElement('div');
                    div.classList.add('species-item');

                    // Create and append the text container
                    const textContainer = document.createElement('div');
                    textContainer.classList.add('text-container');
                    textContainer.innerHTML = `
                        <p><strong>Scientific Name:</strong> <em>${animal.name}</em></p>
                        <p><strong>Class:</strong> ${animal.class}</p>
                        <p><strong>Order:</strong> ${animal.order}</p>
                        <p><strong>Family:</strong> ${animal.family}</p><br>
                        <p><strong>Description:</strong></p>
                        <p>${animal.description}</p><br>
                        <p><strong>Diet:</strong> ${animal.diet}</p><br>
                        <p><strong>Conservation Status:</strong> ${animal["conservation status"]}</p><br>
                        <p><strong>Lifespan:</strong> ${animal.lifespan}</p><br>
                        <p><strong>Habitat:</strong> ${animal.habitat}</p>
                    `;
                    div.appendChild(textContainer);

                    // Create and append the first image
                    const img1 = document.createElement('img');
                    img1.src = animal.image1;
                    img1.alt = animal.name;
                    img1.classList.add('species-image');
                    img1.title = animal.name;
                    div.appendChild(img1);

                    results.appendChild(div);
                });
            } else {
                const noMatch = document.createElement('div');
                noMatch.textContent = 'No information available for this animal.';
                results.appendChild(noMatch);
            }
        })

        .catch(error => {
            console.error('Error:', error);
            const noMatch = document.createElement('div');
            noMatch.textContent = 'Error fetching animal information.';
            results.appendChild(noMatch);
        });
}

document.getElementById("plant-add").addEventListener("submit", async e => {
    e.preventDefault();

    const scientificName = document.getElementById("S_name").value;
    const commonName = document.getElementById("C_name").value;
    const genus = document.getElementById("genus").value;
    const family = document.getElementById("family").value;
    const description = document.getElementById("description").value;
    const habitat = document.getElementById("habitat").value;
    const lifespan = document.getElementById("lifespan").value;
    const varieties = document.getElementById("varieties").value;
    const uses = document.getElementById("uses").value;
    const availability = document.getElementById("availability").value;
    const image = document.getElementById("image").value;

    const response = await fetch('/add-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            S_name: scientificName,
            C_name: commonName,
            genus: genus,
            family: family,
            description: description,
            habitat: habitat,
            lifespan: lifespan,
            varieties: varieties,
            uses: uses,
            availability: availability,
            image: image
        })
    });

    if (response.ok) {
        const result = await response.json();
        alert(result.status === 'success' ? result.message : result.error);
        if (result.status === 'success') {
            window.location.href = "/"; // Redirect after successful addition
        }
    } else {
        const error = await response.json();
        alert(error.error);
    }
});


document.getElementById("plant-delete").addEventListener("submit", async e => {
    e.preventDefault();

    const scientificName = document.getElementById("p_name").value;

    const response = await fetch('/delete-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            p_name: scientificName,
        })
    });

    if (response.ok) {
        const result = await response.json();
        alert(result.status === 'success' ? result.message : result.error);
        if (result.status === 'success') {
            window.location.href = "/"; // Redirect after successful deletion
        }
    } else {
        const error = await response.json();
        alert(error.error);
    }
});


document.getElementById('plant-update').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Collect form data
    const formData = new FormData(this);

    // Send a POST request using fetch
    fetch('/update-plant', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Display the success or error message
        if (data.status === 'success') {
            alert('Plant updated successfully!');
            window.location.href = "/";
        } else {
            alert('Update failed: ' + data.error);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
        alert('An error occurred while updating the plant.');
    });
});

document.getElementById("animal-add").addEventListener("submit", async e => {
    e.preventDefault();  // Prevent the default form submission
    
    const S_name = document.getElementById("s_name").value;
    const Class = document.getElementById("add_class").value;
    const Order = document.getElementById("add_order").value;
    const Family = document.getElementById("add_family").value;
    const Description = document.getElementById("add_description").value;
    const Diet = document.getElementById("add_diet").value;
    const Conservation_status = document.getElementById("conser_status").value;
    const Lifespan = document.getElementById("add_lifespan").value;
    const Habitat = document.getElementById("add_habitat").value;
    const Image1_link = document.getElementById("add_image1").value;
    const Image1_des = document.getElementById("add_image1_des").value;
    const Image2_link = document.getElementById("add_image2").value;
    const Image2_des = document.getElementById("add_image2_des").value;

    const response = await fetch('/add-animal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            s_name: S_name,
            class: Class,
            order: Order,
            family: Family,
            description: Description,
            diet: Diet,
            conser_status: Conservation_status,
            lifespan: Lifespan,
            habitat: Habitat,
            image1: Image1_link,
            image1_des: Image1_des,
            image2: Image2_link,
            image2_des: Image2_des
        })
    });

    const result = await response.json();
    
    alert(result.status === 'success' ? result.message : result.error);
    
    if (result.status === 'success') {
        window.location.href = "/";  // Only redirect on success
    }
});

document.getElementById("animal-delete").addEventListener("submit", async e => {
    e.preventDefault();

    const ScientificName = document.getElementById('a_name').value;

    const response = await fetch('/delete-animal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            a_name: ScientificName,
        })
    });

    if (response.ok) {
        const result = await response.json();
        alert(result.status === 'success' ? result.message : result.error);
        if (result.status === 'success') {
            window.location.href = "/"; // Redirect after successful deletion
        }
    } else {
        const error = await response.json();
        alert(error.error);
    }
});


document.getElementById('animal-update').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Collect form data
    const formData = new FormData(this);

    // Send a POST request using fetch
    try {
        const response = await fetch('/update-animal', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();  // Parse the JSON response

        // Display the success or error message
        if (data.status === 'success') {
            alert('Animal updated successfully!');
            window.location.href = "/";
        } else {
            alert('Update failed: ' + data.error);
        }
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        alert('An error occurred while updating the animal.');
    }
});


 
function showSection(section, element) {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(section).style.display = 'block';

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => link.classList.remove('active'));
    element.classList.add('active');
}

function logout() {
fetch('/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
}).then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        alert('Logged out successfully')
        window.location.href = '/';
    } else {
        alert('Logout failed');
    }
});
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Display the confirmation message
    var confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.style.display = 'block';

    // Optionally, you can clear the form fields
    document.getElementById('contactForm').reset();

    // Hide the confirmation message after 10 seconds
    setTimeout(function() {
        confirmationMessage.style.display = 'none';
    }, 2000); 
});
