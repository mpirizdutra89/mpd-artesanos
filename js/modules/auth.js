// js/modules/auth.js
import { getElement, getAllElements } from '../utils.js';

const elements = {};
let loginImageInterval = null; // Para el carrusel de login

// Imágenes para el carrusel del login
const loginImages = [ //en este caso todas las img son iguales.... Podria ser alimentado de un json donde el servidor cada tanto la actualize
  "img/login/1.jpg",
  "img/login/2.jpg",
  "img/login/3.jpg"
];

function cacheDOMElements() {
  elements.loginPanel = getElement('loginPanel');
  elements.loginButton = getElement('loginButton');
  elements.closeLoginPanelButton = getElement('closeLoginPanelButton');
  elements.loginForm = getElement('loginForm');
  elements.usernameInput = getElement('username');
  elements.passwordInput = getElement('password');
  elements.loginMessage = getElement('loginMessage');
  elements.loginCarousel = getElement('loginCarousel'); // Contenedor del carrusel de login
  elements.body = document.body;

  if (!elements.loginPanel || !elements.loginForm) {
    console.warn('Elementos cruciales del panel de login no encontrados.');
    return false;
  }
  return true;
}

function startLoginCarousel() {

  if (!elements.loginCarousel) return;

  // Limpiar imágenes anteriores para evitar duplicados si se abre varias veces
  elements.loginCarousel.innerHTML = '';

  // Crear y añadir las imágenes al contenedor
  loginImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Imagen de login ${index + 1}`;
    img.classList.add('login-slide-image'); // Clase para identificar las imágenes
    elements.loginCarousel.appendChild(img);

  });

  let currentImageIndex = 0;

  function showNextImage() {
    const slides = elements.loginCarousel.querySelectorAll('.login-slide-image');
    slides.forEach((slide, i) => {
      if (i === currentImageIndex) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });
    currentImageIndex = (currentImageIndex + 1) % loginImages.length;
  }

  showNextImage(); // Mostrar la primera imagen inmediatamente

  loginImageInterval = setInterval(showNextImage, 4000); // Cambia cada 4 segundos
}

function stopLoginCarousel() {
  if (loginImageInterval) {
    clearInterval(loginImageInterval);
    loginImageInterval = null;
  }
  if (elements.loginCarousel) {
    elements.loginCarousel.innerHTML = ''; // Limpiar las imágenes al cerrar
  }
}

function openLoginPanel() {

  if (!elements.loginPanel) return;

  elements.loginPanel.classList.add('active');
  if (elements.body) elements.body.style.overflow = 'hidden';
  if (elements.loginMessage) {
    elements.loginMessage.textContent = '';
    elements.loginMessage.classList.remove('success', 'error');
  }
  if (elements.loginForm) elements.loginForm.reset();
  if (elements.usernameInput) elements.usernameInput.focus();

  startLoginCarousel();
}

function closeLoginPanel() {//toque la x o fuera del modal
  if (!elements.loginPanel) return;

  elements.loginPanel.classList.remove('active');
  if (elements.body) elements.body.style.overflow = '';
  stopLoginCarousel();
}

function handleLoginSubmit(event) {
  event.preventDefault(); // Evita el envío tradicional del formulario

  const username = elements.usernameInput ? elements.usernameInput.value : '';
  const password = elements.passwordInput ? elements.passwordInput.value : '';

  if (username === 'test' && password === 'test') { // Ejemplo de autenticación dummy
    if (elements.loginMessage) {
      elements.loginMessage.textContent = 'Inicio de sesión exitoso.';
      elements.loginMessage.classList.remove('error');
      elements.loginMessage.classList.add('success');
    }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', username); // Guarda el usuario
    // Aquí podrías redirigir o actualizar la UI principal
    setTimeout(() => {
      closeLoginPanel();
      alert(`Bienvenido, ${username}!`); // Mensaje de bienvenida
      // Actualizar estado de UI principal (ej. mostrar nombre de usuario en el header)
      // Esto se manejaría mejor con un evento global o un módulo de usuario.
    }, 1000);
  } else {
    if (elements.loginMessage) {
      elements.loginMessage.textContent = 'Usuario o contraseña incorrectos.';
      elements.loginMessage.classList.remove('success');
      elements.loginMessage.classList.add('error');
    }
  }
}

function setupEventListeners() {
  if (elements.loginButton) {
    elements.loginButton.addEventListener('click', openLoginPanel);
  }
  if (elements.closeLoginPanelButton) {
    elements.closeLoginPanelButton.addEventListener('click', closeLoginPanel);
  }
  if (elements.loginPanel) {
    elements.loginPanel.addEventListener('click', (event) => {
      if (event.target === elements.loginPanel && elements.loginPanel.classList.contains('active')) {
        closeLoginPanel();
      }
    });
  }
  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', handleLoginSubmit);
  }
}

export function initAuth() {
  if (cacheDOMElements()) {
    setupEventListeners();
  }
  // No iniciar el carrusel si el panel no está activo por defecto (lo cual no debería estar)
  // El carrusel se inicia solo cuando openLoginPanel() es llamado.
}