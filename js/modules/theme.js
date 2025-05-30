// js/modules/theme.js
import { getElement } from '../utils.js';

const elements = {};

function cacheDOMElements() {
  elements.body = document.body;
  elements.themeToggleButton = getElement('themeToggleButton'); // Del primer script
  elements.themeIcon = getElement('themeIcon');               // Del primer script
  elements.themeToggleDropdown = getElement('themeToggleDropdown'); // Del segundo script (el botón dentro del userProfileDropdown)
}

function updateThemeToggleButtonText() {
  if (elements.themeToggleDropdown) {
    if (elements.body.classList.contains('dark-mode')) {
      elements.themeToggleDropdown.textContent = 'Modo Claro';
    } else {
      elements.themeToggleDropdown.textContent = 'Modo Oscuro';
    }
  }
  // Si usas el themeToggleButton, también podrías actualizarlo aquí si fuera un texto diferente
  // if (elements.themeToggleButton) {
  //     elements.themeToggleButton.textContent = elements.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
  // }
}

function updateThemeIcon() {
  if (elements.themeIcon) {
    if (elements.body.classList.contains('dark-mode')) {
      elements.themeIcon.classList.remove('fa-moon');
      elements.themeIcon.classList.add('fa-sun');
    } else {
      elements.themeIcon.classList.remove('fa-sun');
      elements.themeIcon.classList.add('fa-moon');
    }
  }
}

export function enableDarkMode() {
  if (elements.body) {
    elements.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    updateThemeToggleButtonText();
    updateThemeIcon();
  }
}

export function disableDarkMode() {
  if (elements.body) {
    elements.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    updateThemeToggleButtonText();
    updateThemeIcon();
  }
}

export function toggleTheme() {
  if (elements.body && elements.body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

export function initTheme() {
  cacheDOMElements();

  // Inicializar el tema al cargar la página
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  } else {
    disableDarkMode(); // Asegura que el modo claro se aplique si no hay preferencia o es 'light'
  }

  // Configurar listeners
  if (elements.themeToggleButton) {
    elements.themeToggleButton.addEventListener('click', toggleTheme);
  }
  if (elements.themeToggleDropdown) {
    elements.themeToggleDropdown.addEventListener('click', toggleTheme);
  }
}