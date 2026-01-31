document.addEventListener('DOMContentLoaded', () => {
    const offerForm = document.getElementById('offerForm');
    const offersContainer = document.getElementById('offersContainer');

    // Load offers on page load
    loadOffers();

    offerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(offerForm);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                if (typeof M !== 'undefined') {
                    M.toast({html: 'Offer created successfully!'});
                }
                offerForm.reset();
                loadOffers();
            } else {
                const err = await response.json();
                console.error('Upload failed:', err);
                if (typeof M !== 'undefined') {
                    M.toast({html: `Failed: ${err.error || err.message}`});
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (typeof M !== 'undefined') {
                M.toast({html: 'Error creating offer'});
            }
        }
    });

    async function loadOffers() {
        try {
            const response = await fetch('/offers');
            const offers = await response.json();
            
            offersContainer.innerHTML = '';

            offers.forEach(offer => {
                const offerDiv = document.createElement('div');
                offerDiv.className = 'col s12 m6 l4 offerDiv';

                let imageHtml = '';
                if (offer.image) {
              
                    const imagePath = offer.image.path.replace('public/', '');
                    imageHtml = `
                        <div class="card-image">
                            <img class="responsive-img" src="${imagePath}" alt="${offer.title}">
                            <span class="card-title" style="text-shadow: 1px 1px 2px black;">${offer.title}</span>
                        </div>
                    `;
                } else {
                     imageHtml = `
                        <div class="card-image">
                            <img class="responsive-img" src="https://placehold.co/600x400?text=No+Image" alt="No Image">
                            <span class="card-title" style="text-shadow: 1px 1px 2px black;">${offer.title}</span>
                        </div>
                    `;
                }

                offerDiv.innerHTML = `
                    <div class="card hoverable">
                        ${imageHtml}
                        <div class="card-content">
                            <p><strong>Price:</strong> ${offer.price} €</p>
                            <p>${offer.description}</p>
                        </div>
                    </div>
                `;

                offersContainer.appendChild(offerDiv);
            });
        } catch (error) {
            console.error('Error loading offers:', error);
        }
    }
});
