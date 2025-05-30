
import { getElement, getAllElements } from '../utils.js';

const elements = {};
let currentSlideIndex = 0;
let currentPortfolioImages = [];


// Datos dummy de ejemplo para el portafolio (pueden venir de una API real)
const dummyPortfolios = [
  {
    id: 1,
    artistName: "Ana Silva",
    portfolioTitle: "Paisajes Mágicos",
    thumbnail: "img/1.jpg",
    images: [
      "img/1.jpg",
      "img/2.jpg",
      "img/3.jpg"
    ]
  },
  {
    id: 2,
    artistName: "Beto Ruiz",
    portfolioTitle: "Retratos Urbanos",
    thumbnail: "img/4.jpg",
    images: [
      "img/4.jpg",
      "img/5.jpg",
      "img/6.jpg"
    ]
  },
  {
    id: 3,
    artistName: "Carla Gómez",
    portfolioTitle: "Abstracciones Digitales",
    thumbnail: "img/3.jpg", // Usamos una existente por simplicidad
    images: [
      "img/1.jpg",
      "img/5.jpg",
      "img/2.jpg"
    ]
  }
];

function cacheDOMElements() {
  elements.portfoliosgrid = getElement('portfolios-grid')
  elements.portfolioModal = getElement('portfolioModal');
  elements.closePortfolioModalButton = getElement('closePortfolioModalButton');
  elements.modalPortfolioTitle = getElement('modalPortfolioTitle');
  elements.modalPortfolioArtist = getElement('modalPortfolioArtist');
  elements.modalGalleryTrack = getElement('modalGallery'); // Primer script: 'modalGallery'
  elements.carouselPrevBtn = getElement('carouselPrevBtn'); // Primer script
  elements.carouselNextBtn = getElement('carouselNextBtn'); // Primer script
  elements.carouselDotsContainer = getElement('carouselDots'); // Primer script: 'carouselDots'

  elements.body = document.body;

  if (!elements.portfolioModal /* || !elements.modalGalleryTrack */) {
    console.error('Elementos cruciales del modal de portafolio no encontrados.');
    return false;
  }
  return true;
}

export const idPortafolio = elements.portfolio;

function renderPortfolios(portfolios) {
  elements.portfoliosgrid.innerHTML = '';
  portfolios.forEach(portfolio => {
    const card = document.createElement('div');
    card.classList.add('portfolio-card');
    card.innerHTML = `
                <img src="${portfolio.thumbnail}" alt="Miniatura de ${portfolio.portfolioTitle}" class="portfolio-thumbnail">
                <h3>${portfolio.artistName}</h3>
                <p>${portfolio.portfolioTitle}</p>
                <span class="view-portfolio" data-portfolio-id="${portfolio.id}">Ver Portafolio</span>
            `;
    elements.portfoliosgrid.appendChild(card);
  });
}



function updateCarousel() {
  if (!elements.modalGalleryTrack || !elements.carouselDotsContainer) return;
  const offset = -currentSlideIndex * 100;
  elements.modalGalleryTrack.style.transform = `translateX(${offset}%)`;

  const dots = elements.carouselDotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index === currentSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}


function moveToSlide(index) {
  if (!currentPortfolioImages.length) return;
  currentSlideIndex = (index + currentPortfolioImages.length) % currentPortfolioImages.length;
  updateCarousel();
}


export function openPortfolioModal(portfolio) {
  elements.modalPortfolioTitle.textContent = portfolio.portfolioTitle || portfolio.title; // Ambos scripts usan nombres ligeramente distintos
  elements.modalPortfolioArtist.textContent = `De: ${portfolio.artistName || portfolio.artist}`;
  elements.modalGalleryTrack.innerHTML = '';
  elements.carouselDotsContainer.innerHTML = '';

  currentPortfolioImages = portfolio.images;
  currentSlideIndex = 0;

  portfolio.images.forEach((imageUrl, index) => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Imagen ${index + 1} del portafolio`;
    elements.modalGalleryTrack.appendChild(img);

    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.dataset.slideIndex = index;
    dot.addEventListener('click', () => {
      moveToSlide(index);
    });
    elements.carouselDotsContainer.appendChild(dot);
  });

  updateCarousel();
  elements.portfolioModal.style.display = 'flex';
  elements.body.style.overflow = 'hidden';
}



function closePortfolioModal() {

  if (!elements.portfolioModal) return;
  elements.portfolioModal.style.display = 'none';
  if (elements.body) elements.body.style.overflow = '';
}

function setupEventListeners() {

  if (elements.carouselPrevBtn) {
    elements.carouselPrevBtn.addEventListener('click', () => moveToSlide(currentSlideIndex - 1));
  }
  if (elements.carouselNextBtn) {
    elements.carouselNextBtn.addEventListener('click', () => moveToSlide(currentSlideIndex + 1));
  }
  if (elements.portfolioModal) {

    elements.portfolioModal.addEventListener('click', (event) => {
      if (event.target === elements.closePortfolioModalButton) {

        closePortfolioModal();
      }

    });

    elements.portfoliosgrid.addEventListener('click', (event) => {
      const viewPortfolioSpan = event.target.closest('.view-portfolio');
      if (viewPortfolioSpan) {
        const portfolioId = parseInt(viewPortfolioSpan.dataset.portfolioId);
        const selectedPortfolio = dummyPortfolios.find(p => p.id === portfolioId);
        if (selectedPortfolio) {
          openPortfolioModal(selectedPortfolio);
        }
      }
    });

  }


}

export function initPortfolioModal() {
  if (cacheDOMElements()) {
    setupEventListeners();
    renderPortfolios(dummyPortfolios);
  }
}

// Exporta los datos dummy para que otras secciones puedan usarlos si es necesario
export { dummyPortfolios };