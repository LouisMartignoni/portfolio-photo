/**
 * Portfolio Photo - Script principal
 * Navigation, Galerie et Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Données des photos organisées par catégorie
    // ========================================
    const categories = [
        {
            name: 'Thailand-Cambodge',
            title: 'Thailand & Cambodge',
            photos: [
                { src: 'images/Thailand-Cambodge/IMG_4576.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_4881-2.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_4933.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_4977.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_4996.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_5008.jpg', alt: 'Thailand-Cambodge' },
                { src: 'images/Thailand-Cambodge/IMG_5131.jpg', alt: 'Thailand-Cambodge' },
            ]
        },
        {
            name: 'Vanoise',
            title: 'Vanoise',
            photos: [
                { src: 'images/Vanoise/IMG_5576.jpg', alt: 'Vanoise' },
                { src: 'images/Vanoise/IMG_5678.jpg', alt: 'Vanoise' },
            ]
        },
        {
            name: 'Paris',
            title: 'Paris',
            photos: [
                { src: 'images/Paris/IMG_6108.jpg', alt: 'Paris' },
                { src: 'images/Paris/IMG_6126.jpg', alt: 'Paris' },
                { src: 'images/Paris/IMG_6130.jpg', alt: 'Paris' },
            ]
        }
    ];

    // Flatten photos for lightbox navigation
    const allPhotos = categories.flatMap(cat => cat.photos);

    // ========================================
    // Éléments DOM
    // ========================================
    const galleryContainer = document.getElementById('gallery-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCurrent = lightbox.querySelector('.current');
    const lightboxTotal = lightbox.querySelector('.total');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    let currentPhotoIndex = 0;

    // ========================================
    // Génération de la galerie par sections
    // ========================================
    function createGallery() {
        galleryContainer.innerHTML = '';
        let globalIndex = 0;

        categories.forEach((category, catIndex) => {
            // Create section
            const section = document.createElement('div');
            section.className = 'gallery-section';

            // Create title
            const title = document.createElement('h2');
            title.className = 'gallery-title';
            title.textContent = category.title;
            section.appendChild(title);

            // Create grid
            const grid = document.createElement('div');
            grid.className = 'gallery-grid';

            category.photos.forEach((photo, photoIndex) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.index = globalIndex;

                const img = document.createElement('img');
                img.className = 'gallery-image';
                img.src = photo.src;
                img.alt = photo.alt;
                img.loading = 'lazy';

                item.appendChild(img);
                grid.appendChild(item);
                globalIndex++;
            });

            section.appendChild(grid);
            galleryContainer.appendChild(section);
        });

        // Update total counter
        lightboxTotal.textContent = allPhotos.length;
    }

    // ========================================
    // Lightbox
    // ========================================
    function openLightbox(index) {
        currentPhotoIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const photo = allPhotos[currentPhotoIndex];
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxCurrent.textContent = currentPhotoIndex + 1;
    }

    function nextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
        updateLightboxImage();
    }

    function prevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
        updateLightboxImage();
    }

    // ========================================
    // Navigation mobile
    // ========================================
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    // ========================================
    // Event Listeners
    // ========================================

    // Clic sur une photo de la galerie
    galleryContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            const index = parseInt(item.dataset.index, 10);
            openLightbox(index);
        }
    });

    // Contrôles lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextPhoto);
    lightboxPrev.addEventListener('click', prevPhoto);

    // Clic en dehors de l'image pour fermer
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                nextPhoto();
                break;
            case 'ArrowLeft':
                prevPhoto();
                break;
        }
    });

    // Menu mobile
    menuToggle.addEventListener('click', toggleMenu);

    // Fermer le menu mobile en cliquant sur un lien
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Support tactile pour swipe dans la lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextPhoto();
            } else {
                prevPhoto();
            }
        }
    }

    // ========================================
    // Initialisation
    // ========================================
    createGallery();
});
