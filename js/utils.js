// js/utils.js

/**
 * Función de ayuda para obtener un elemento del DOM por su ID.
 * Emite una advertencia si el elemento no se encuentra.
 * @param {string} id - El ID del elemento a buscar.
 * @returns {HTMLElement | null} El elemento encontrado o null si no existe.
 */
export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Elemento con ID "${id}" no encontrado en el DOM. En caso de que la vista actual no lo use no abra fallos. Esto es solo un cartel de informacion`);
    }
    return element;
}

/**
 * Función de ayuda para obtener varios elementos del DOM por un selector.
 * @param {string} selector - El selector CSS para los elementos a buscar.
 * @returns {NodeListOf<HTMLElement>} Una NodeList de los elementos encontrados.
 */
export function getAllElements(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        // console.warn(`Ningún elemento encontrado con el selector "${selector}".`);
    }
    return elements;
}

/**
 * Calcula el tiempo transcurrido desde una fecha dada.
 * @param {Date} date - La fecha a partir de la cual calcular el tiempo transcurrido.
 * @returns {string} Una cadena que describe el tiempo transcurrido (ej: "5 minutos", "2 días").
 */
export function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " año" : " años");
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " mes" : " meses");
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " día" : " días");
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hora" : " horas");
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minuto" : " minutos");
    return Math.floor(seconds) + (Math.floor(seconds) === 1 ? " segundo" : " segundos");
}

let currentSlideIndex = 0;
let currentPortfolioImages = [];
let contenedorGaleria = ""

export function galeriaInit(modal) {

    if (getElement('carouselPrevBtn')) {
        getElement('carouselPrevBtn').addEventListener('click', () => moveToSlide(currentSlideIndex - 1));

    }
    if (getElement('carouselNextBtn')) {
        getElement('carouselNextBtn').addEventListener('click', () => moveToSlide(currentSlideIndex + 1));

    }



    if (getElement('closeModal')) {

        getElement('closeModal').addEventListener('click', () => closeModal(modal));
    }

}




export function carruselGaleria(portfolio, contenedor) {
    contenedorGaleria = contenedor
    const cDots = getElement('carouselDots')
    currentPortfolioImages = portfolio.images;
    currentSlideIndex = 0;
    contenedor.innerHTML = ''
    cDots.innerHTML = ''
    portfolio.images.forEach((imageUrl, index) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Imagen ${index + 1} del portafolio`;
        contenedor.appendChild(img);

        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slideIndex = index;
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
        cDots.appendChild(dot);
    });

    updateCarousel();
}

function updateCarousel() {
    const cDots = getElement('carouselDots')
    const offset = -currentSlideIndex * 100;
    contenedorGaleria.style.transform = `translateX(${offset}%)`;

    const dots = cDots.querySelectorAll('.dot');
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

export function closeModal(modal) {


    getElement(modal).style.display = 'none';
    if (document.body) document.body.style.overflow = '';
}
export function openModal(modal) {
    if (!modal) return;
    getElement(modal).style.display = 'flex';
    if (document.body) document.body.style.overflow = 'hidden';
}