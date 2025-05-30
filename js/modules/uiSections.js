// js/modules/uiSections.js
import { getElement, getAllElements, carruselGaleria, closeModal, openModal, galeriaInit } from '../utils.js';
//import { openGaleria, dummyPortfolios } from './portfolioModal.js'; // Importamos la función y los datos del modal

const elements = {};
// Nuevo dataset para álbumes (puedes añadir más si tienes imágenes)
const dummyAlbums = [
  { id: 'a1', title: 'Amaneceres Costeros', cover: 'img/1.jpg', images: ['img/1.jpg', 'img/2.jpg'] },
  { id: 'a2', title: 'Flores de Verano', cover: 'img/3.jpg', images: ['img/3.jpg', 'img/4.jpg'] },
  { id: 'a3', title: 'Retratos Urbanos', cover: 'img/6.jpg', images: ['img/3.jpg', 'img/1.jpg'] },
  { id: 'a4', title: 'Arquitectura Gótica', cover: 'img/4.jpg', images: ['img/4.jpg', 'img/5.jpg'] },
  { id: 'a5', title: 'Viajes a la Luna', cover: 'img/5.jpg', images: ['img/5.jpg', 'img/6.jpg'] },
  { id: 'a6', title: 'Sabores del Mundo', cover: 'img/6.jpg', images: ['img/6.jpg', 'img/4.jpg'] },
  { id: 'a7', title: 'Abstractos Modernos', cover: 'img/2.jpg', images: ['img/2.jpg', 'img/2.jpg'] },
  { id: 'a8', title: 'Fauna Silvestre', cover: 'img/3.jpg', images: ['img/3.jpg', 'img/3.jpg'] },
];


function cacheDOMElements() {
  elements.portfoliosGrid = getElement('portfolios-grid');
  elements.searchButton = getElement('searchButton');
  elements.searchInput = getElement('searchInput');
  elements.subMenuButtons = getAllElements('.sub-menu-btn'); // NodeList
  elements.albumsGrid = getElement('albumsGrid');

  // Secciones de contenido principales
  elements.albumsSection = getElement('albumsSection');
  elements.friendsSection = getElement('friendsSection');
  elements.portfolioSection = getElement('portfolioSection');
  elements.statsSection = getElement('statsSection');

  elements.ModalGaleriaContainer = getElement('ModalGaleria')
  elements.closeModal = getElement('closeModal')
  elements.modalTitulo = getElement('modalTitulo')
  elements.modalNameArtista = getElement('modalNameArtista')
  elements.modalAlbumContainer = getElement('modalGallery')
  elements.body = document.body;

  //init

  // No es crítico que todos existan, pero es bueno advertir si faltan los principales
  if (!elements.portfoliosGrid || !elements.albumsGrid) {
    console.warn('Elementos clave de las secciones de contenido (grids) no encontrados.');
  }
  return true;

}
galeriaInit("ModalGaleria");
function openGaleria(galeria) {
  elements.modalTitulo.textContent = galeria.title; // Ambos scripts usan nombres ligeramente distintos

  carruselGaleria(galeria, elements.modalAlbumContainer)

  openModal("ModalGaleria")

}


/**
 * Renderiza los portafolios en la cuadrícula principal.
 * @param {Array<Object>} portfolios - Array de objetos de portafolio.
 */
/* function renderPortfolios(portfolios) {
  if (!elements.portfoliosGrid) return;
  elements.portfoliosGrid.innerHTML = '';
  portfolios.forEach(portfolio => {
    const card = document.createElement('div');
    card.classList.add('portfolio-card');
    // Asegúrate de que portfolio.thumbnail o portfolio.images[0].src exista
    const imgSrc = portfolio.thumbnail || (portfolio.images && portfolio.images[0] ? portfolio.images[0].src : 'path/to/default-thumbnail.jpg');
    const imgAlt = portfolio.portfolioTitle || portfolio.title;

    card.innerHTML = `
            <img src="${imgSrc}" alt="Miniatura de ${imgAlt}" class="portfolio-thumbnail">
            <h3>${portfolio.artistName || portfolio.artist}</h3>
            <p>${portfolio.portfolioTitle || portfolio.title}</p>
            <span class="view-portfolio" data-portfolio-id="${portfolio.id}">Ver Portafolio</span>
        `;
    card.addEventListener('click', (event) => {
      const viewPortfolioSpan = event.target.closest('.view-portfolio');
      if (viewPortfolioSpan) {
        const portfolioId = parseInt(viewPortfolioSpan.dataset.portfolioId);
        const selectedPortfolio = dummyPortfolios.find(p => p.id === portfolioId);
        if (selectedPortfolio) {
          openGaleria(selectedPortfolio); // Reutiliza la función del módulo portfolioModal
        }
      } else if (event.target.classList.contains('portfolio-card') || event.target.closest('.portfolio-card')) {
        // Si se hace clic en la tarjeta misma (no en el span "Ver Portafolio")
        const cardElement = event.target.closest('.portfolio-card');
        const portfolioId = parseInt(cardElement.dataset.id);
        const selectedPortfolio = dummyPortfolios.find(p => p.id === portfolioId);
        if (selectedPortfolio) {
          openGaleria(selectedPortfolio);
        }
      }
    });
    elements.portfoliosGrid.appendChild(card);
  });
}
 */
/**
 * Renderiza los álbumes en la cuadrícula de álbumes.
 * @param {Array<Object>} albums - Array de objetos de álbum.
 */
function renderAlbums(albums) {
  if (!elements.albumsGrid) return;
  elements.albumsGrid.innerHTML = ''; // Limpia la cuadrícula actual

  if (albums.length === 0) {
    elements.albumsGrid.innerHTML = '<p>No hay álbumes para mostrar.</p>';
    return;
  }

  albums.forEach(album => {
    const albumCard = document.createElement('div');
    albumCard.classList.add('album-card');
    albumCard.dataset.id = album.id; // Guarda el ID del álbum para futuras acciones

    albumCard.innerHTML = `
            <img src="${album.cover}" alt="${album.title}">
            <div class="album-overlay">
                <h3 class="album-title">${album.title}</h3>
                <div class="album-actions">
                    <button class="action-btn view-album" title="Ver Álbum" data-album-id="${album.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-album" title="Editar Álbum" data-album-id="${album.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn share-album" title="Compartir Álbum" data-album-id="${album.id}"><i class="fas fa-share-alt"></i></button>
                    <button class="action-btn delete-album delete-btn" title="Eliminar Álbum" data-album-id="${album.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    elements.albumsGrid.appendChild(albumCard);
  });



  // Añadir listeners a los botones de acción de los álbumes
  elements.albumsGrid.querySelectorAll('.view-album').forEach(button => {
    button.addEventListener('click', (event) => {
      const albumId = event.currentTarget.dataset.albumId;
      //alert(`Simulando ver álbum: ${albumId}`);
      // Aquí podrías abrir un modal con las imágenes del álbum
      const selectedAlbum = dummyAlbums.find(a => a.id === albumId);
      if (selectedAlbum) { openGaleria(selectedAlbum); }
    });
  });

  elements.albumsGrid.querySelectorAll('.edit-album').forEach(button => {
    button.addEventListener('click', (event) => {
      const albumId = event.currentTarget.dataset.albumId;
      alert(`Simulando editar álbum: ${albumId}`);
    });
  });

  elements.albumsGrid.querySelectorAll('.share-album').forEach(button => {
    button.addEventListener('click', (event) => {
      const albumId = event.currentTarget.dataset.albumId;
      alert(`Simulando compartir álbum: ${albumId}`);
    });
  });

  elements.albumsGrid.querySelectorAll('.delete-album').forEach(button => {
    button.addEventListener('click', (event) => {
      const albumId = event.currentTarget.dataset.albumId;
      if (confirm(`¿Estás seguro de que quieres eliminar el álbum ${albumId}?`)) {
        alert(`Simulando eliminar álbum: ${albumId}`);
        // Aquí podrías eliminar el álbum del array y volver a renderizar
      }
    });
  });
}

/**
 * Alterna la visibilidad de las secciones de contenido y actualiza el estado activo del sub-menú.
 * @param {string} sectionId - El ID de la sección a mostrar (ej: 'albumsSection').
 */
export function showContentSection(sectionId) {
  // Oculta todas las secciones de contenido
  getAllElements('.content-section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none'; // Ocultar completamente si es necesario
  });

  // Muestra la sección deseada
  const targetSection = getElement(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block'; // Asegura que la sección se muestre
  }

  // Actualiza el estado activo de los botones del sub-menú
  elements.subMenuButtons.forEach(button => {
    if (button.dataset.section === sectionId.replace('Section', '')) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Renderiza el contenido específico de la sección si es necesario
  if (sectionId === 'portfolioSection') {
    renderPortfolios(dummyPortfolios);
  } else if (sectionId === 'albumsSection') {
    renderAlbums(dummyAlbums);
  }
  // Puedes añadir más casos para 'friendsSection', 'statsSection' etc.
}


function setupEventListeners() {
  if (elements.searchButton && elements.searchInput) {
    elements.searchButton.addEventListener('click', () => {
      const query = elements.searchInput.value;
      alert(`Buscando: "${query}" (Aquí iría la llamada a tu API de búsqueda)`);
    });
  }

  // Event listeners para los botones del sub-menú
  elements.subMenuButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const section = event.target.dataset.section;
      showContentSection(`${section}Section`);
    });
  });
}

export function initUISections() {
  if (cacheDOMElements()) {
    setupEventListeners();
    // Mostrar la sección de Álbumes por defecto al cargar la página
    showContentSection('albumsSection');
  }
}