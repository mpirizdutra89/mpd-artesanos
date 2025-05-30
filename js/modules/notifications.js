// js/modules/notifications.js
import { getElement, getTimeAgo } from '../utils.js';

const elements = {};
let unreadNotifications = 0;
const allNotifications = []; // Almacena todas las notificaciones

const notificationTypes = {
  friendRequest: {
    icon: 'fas fa-user-plus',
    text: (name) => `<strong>${name}</strong> te ha enviado una solicitud de amistad.`,
    className: 'notification-type-friend-request'
  },
  comment: {
    icon: 'fas fa-comment',
    text: (author, work) => `<strong>${author}</strong> ha comentado en tu obra "${work}".`,
    className: 'notification-type-comment'
  },
  achievement: {
    icon: 'fas fa-trophy',
    text: (detail) => `¡Felicidades! ${detail}`,
    className: 'notification-type-achievement'
  }
};

function cacheDOMElements() {
  elements.notificationButton = getElement('notificationButton');
  elements.notificationCount = getElement('notificationCount');
  elements.notificationDropdown = getElement('notificationDropdown');
  elements.notificationList = getElement('notificationList');

  if (!elements.notificationButton || !elements.notificationDropdown) {
    console.warn('Elementos cruciales de notificaciones no encontrados.');
    return false;
  }
  return true;
}

/**
 * Añade una nueva notificación.
 * @param {string} typeKey - Clave del tipo de notificación (ej. 'friendRequest').
 * @param {Array<string>} detailArgs - Argumentos para la función de texto del tipo de notificación.
 * @param {string} [link='#'] - URL a la que enlaza la notificación.
 */
export function addNotification(typeKey, detailArgs, link = '#') {
  const typeInfo = notificationTypes[typeKey];
  if (!typeInfo) {
    console.warn(`Tipo de notificación '${typeKey}' no definido.`);
    return;
  }

  const detailText = typeInfo.text(...detailArgs);

  const notification = {
    id: Date.now() + Math.random(),
    type: typeInfo.icon,
    detail: detailText,
    link,
    timestamp: new Date(),
    read: false,
    className: typeInfo.className
  };
  allNotifications.unshift(notification); // Añadir al principio

  if (!notification.read) {
    unreadNotifications++;
  }
  updateNotificationDisplay();
  // Si el dropdown está abierto, renderizar inmediatamente
  if (elements.notificationDropdown && elements.notificationDropdown.classList.contains('active')) {
    renderNotifications();
  }
}

function updateNotificationDisplay() {
  if (elements.notificationCount) {
    elements.notificationCount.textContent = unreadNotifications > 0 ? unreadNotifications : '';
    elements.notificationCount.style.display = unreadNotifications > 0 ? 'block' : 'none';
  }
}

function renderNotifications() {
  if (!elements.notificationList) return;
  elements.notificationList.innerHTML = '';
  const notificationsToShow = allNotifications.slice(0, 5); // Mostrar las 5 más recientes

  if (notificationsToShow.length === 0) {
    elements.notificationList.innerHTML = '<div class="notification-item no-notifications">No tienes notificaciones nuevas.</div>';
    return;
  }

  notificationsToShow.forEach(n => {
    const timeAgo = getTimeAgo(n.timestamp);
    const notificationItem = document.createElement('a');
    notificationItem.href = n.link;
    notificationItem.classList.add('notification-item', n.className);
    if (!n.read) {
      notificationItem.classList.add('unread');
    }
    notificationItem.innerHTML = `
            <p class="notification-detail"><i class="${n.type}"></i> ${n.detail}</p>
            <span class="notification-time">${timeAgo}</span>
        `;
    notificationItem.addEventListener('click', (event) => {
      // event.preventDefault(); // Si quieres que no navegue para mostrar el efecto
      markNotificationAsRead(n.id);
      // Aquí puedes añadir más lógica, como cerrar el dropdown si lo deseas
    });
    elements.notificationList.appendChild(notificationItem);
  });
}

function markNotificationAsRead(id) {
  const notification = allNotifications.find(n => n.id === id);
  if (notification && !notification.read) {
    notification.read = true;
    unreadNotifications--;
    updateNotificationDisplay();
    // Volver a renderizar solo si el dropdown está abierto
    if (elements.notificationDropdown && elements.notificationDropdown.classList.contains('active')) {
      renderNotifications();
    }
  }
}

function simulateInitialNotifications() {
  // Resetear para demostraciones
  allNotifications.length = 0;
  unreadNotifications = 0;

  addNotification('friendRequest', ['Ana López'], '#');
  addNotification('comment', ['Pedro R.', 'Mi Ciudad Soñada'], '#');
  addNotification('achievement', ['Tu obra "Danza de Colores" ha superado las 500 vistas'], '#');
  addNotification('friendRequest', ['María Fernández'], '#');
  addNotification('comment', ['Sofía P.', 'El Retrato de la Abuela'], '#');

  // Marcar algunas como leídas para demostración
  markNotificationAsRead(allNotifications[4].id);
  markNotificationAsRead(allNotifications[2].id);
  updateNotificationDisplay();
  // renderNotifications(); // Esto se llamará cuando se abra el dropdown
}

function setupEventListeners() {
  if (elements.notificationButton) {
    elements.notificationButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Evita que el clic se propague al window listener
      toggleDropdown(elements.notificationDropdown);
      // Al abrir el dropdown de notificaciones, marcarlas todas como leídas
      allNotifications.forEach(n => {
        if (!n.read) {
          n.read = true;
          unreadNotifications--;
        }
      });
      updateNotificationDisplay(); // Actualiza el contador a 0
      renderNotifications(); // Renderiza el listado de notificaciones actualizado
    });
  }
}

// Función auxiliar para togglrar dropdowns (se puede reubicar en un módulo de UI más genérico)
function toggleDropdown(dropdownElement) {
  document.querySelectorAll('.dropdown-menu.active').forEach(openDropdown => {
    if (openDropdown !== dropdownElement) {
      openDropdown.classList.remove('active');
    }
  });
  dropdownElement.classList.toggle('active');
}

export function initNotifications() {
  if (cacheDOMElements()) {
    setupEventListeners();
    simulateInitialNotifications(); // Carga las notificaciones de ejemplo al iniciar
  }
}

// Exporta toggleDropdown para que otros módulos lo puedan usar si tienen dropdowns en el header
export { toggleDropdown };