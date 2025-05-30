// js/main.js
import { initAuth } from './modules/auth.js';
import { initPortfolioModal, idPortafolio } from './modules/portfolioModal.js';
import { initTheme, toggleTheme } from './modules/theme.js';
import { initNotifications, addNotification, toggleDropdown } from './modules/notifications.js';
import { initUISections, showContentSection } from './modules/uiSections.js';
import { getElement } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado y parseado. Inicializando la aplicación.');

  // --- Inicializar Módulos ---
  initTheme();          // Inicializa el tema (modo oscuro/claro)
  initAuth();           // Inicializa la lógica de autenticación y el panel de login
  if (idPortafolio) initPortfolioModal();


  initNotifications();  // Inicializa las notificaciones
  initUISections();     // Inicializa el manejo de secciones (portafolios, álbumes, etc.)

  // --- Event Listeners Globales (o que conectan varios módulos) ---

  // Listener para cerrar dropdowns (perfil de usuario, notificaciones) al hacer clic fuera
  const userProfileButton = getElement('userProfileButton');
  const userProfileDropdown = getElement('userProfileDropdown');
  const logoutButton = getElement('logoutButton');
  const viewProfileLink = getElement('viewProfileLink');
  const bodyElement = document.body; // Referencia al body

  if (userProfileButton && userProfileDropdown) {
    userProfileButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown(userProfileDropdown);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('Cerrar Sesión (simulado por el diseñador)');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInUser');
      // Aquí podrías redirigir a la página de login o actualizar el estado de la UI
      if (userProfileDropdown) userProfileDropdown.classList.remove('active');
    });
  }

  if (viewProfileLink) {
    viewProfileLink.addEventListener('click', (event) => {
      event.preventDefault();
      alert('Navegando a la vista "Editar Perfil" (simulado por el diseñador)');
      if (userProfileDropdown) userProfileDropdown.classList.remove('active');
    });
  }

  // Cierre de cualquier dropdown activo o modal al hacer clic en cualquier lugar del body
  // Esto se maneja mejor en cada módulo, pero se puede tener un fallback aquí.
  bodyElement.addEventListener('click', (event) => {
    // Cierre de dropdowns
    document.querySelectorAll('.dropdown-menu.active').forEach(dropdown => {
      // Verifica si el clic fue fuera del dropdown y su botón activador
      // Esta lógica se abstrajo en toggleDropdown dentro de notifications.js para reuso,
      // pero si necesitas un listener global para todo, podría ser aquí.
      const relatedButtonId = dropdown.dataset.relatedButtonId; // Podrías añadir este data-attribute
      const relatedButton = relatedButtonId ? getElement(relatedButtonId) : null;

      if (!dropdown.contains(event.target) && (!relatedButton || !relatedButton.contains(event.target))) {
        dropdown.classList.remove('active');
      }
    });

    // Asegurar que los modales también se cierren al hacer clic fuera (ya manejado en sus módulos)
    // Puedes dejarlo aquí como una doble capa de seguridad si quieres, pero lo ideal es que cada modal lo maneje.
    // if (event.target === getElement('portfolioModal')) closePortfolioModal();
    // if (event.target === getElement('loginPanel')) closeLoginPanel();
  });

  // --- Comandos de depuración o inicialización adicionales ---
  // Si necesitas simular algo o forzar una acción al cargar la página
  // Por ejemplo, para ver el modal de portafolio al inicio (solo para desarrollo):
  // openPortfolioModal(dummyPortfolios[0]);
  // addNotification('achievement', ['Has logrado un nuevo hito'], '#');
});

// Importante: Asegúrate de que tus archivos HTML carguen main.js como un módulo:
// <script type="module" src="js/main.js"></script>