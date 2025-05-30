
document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes del DOM existentes (mantener) ---
    const searchButton = document.getElementById('searchButton');
    const portfoliosGrid = document.getElementById('portfolios-grid'); // Puede ser usado para la sección "Mi Portafolio"
    const portfolioModal = document.getElementById('portfolioModal');
    const closePortfolioModalButton = document.getElementById('closePortfolioModalButton');
    const modalGalleryInner = document.getElementById('modalGalleryInner');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');
    const modalGalleryDots = document.getElementById('modalGalleryDots');
    const modalPortfolioTitle = document.getElementById('modalPortfolioTitle');
    const modalPortfolioArtist = document.getElementById('modalPortfolioArtist');
    const commentList = document.getElementById('commentList');
    const commentForm = document.getElementById('commentForm');

    const loginPanel = document.getElementById('loginPanel');
    const loginButton = document.getElementById('loginButton');
    const closeLoginPanelButton = document.getElementById('closeLoginPanelButton');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    const loginCarousel = document.getElementById('loginCarousel');

    // --- Nuevos elementos del DOM (del header, ya están en tu script) ---
    const notificationButton = document.getElementById('notificationButton');
    const notificationCount = document.getElementById('notificationCount');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');
    const userProfileButton = document.getElementById('userProfileButton');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const themeToggleDropdown = document.getElementById('themeToggleDropdown');
    const logoutButton = document.getElementById('logoutButton');
    const viewProfileLink = document.getElementById('viewProfileLink');

    // --- Nuevos elementos del DOM (Sub-menú y Álbumes) ---
    const subMenuButtons = document.querySelectorAll('.sub-menu-btn');
    const albumsGrid = document.getElementById('albumsGrid');
    const albumsSection = document.getElementById('albumsSection');
    const friendsSection = document.getElementById('friendsSection');
    const portfolioSection = document.getElementById('portfolioSection');
    const statsSection = document.getElementById('statsSection');


    // --- Variables existentes (mantener) ---
    let currentSlideIndex = 0;
    let currentPortfolioImages = [];
    let loginCarouselInterval;

    // --- Datos de ejemplo (dummies) ---
    // Mantén tus dummyPortfolios aquí

    // Nuevo dataset para álbumes (puedes añadir más si tienes imágenes)
    const dummyAlbums = [
        { id: 'a1', title: 'Amaneceres Costeros', cover: 'img/1.jpg', images: ['img/album/album-dummy-1.jpg', 'img/album/album-dummy-2.jpg'] },
        { id: 'a2', title: 'Flores de Verano', cover: 'img/2.jpg', images: ['img/album/album-dummy-2.jpg', 'img/album/album-dummy-3.jpg'] },
        { id: 'a3', title: 'Retratos Urbanos', cover: 'img/3.jpg', images: ['img/album/album-dummy-3.jpg', 'img/album/album-dummy-1.jpg'] },
        { id: 'a4', title: 'Arquitectura Gótica', cover: 'img/4.jpg', images: ['img/album/album-dummy-4.jpg', 'img/album/album-dummy-5.jpg'] },
        { id: 'a5', title: 'Viajes a la Luna', cover: 'img/5.jpg', images: ['img/album/album-dummy-5.jpg', 'img/album/album-dummy-6.jpg'] },
        { id: 'a6', title: 'Sabores del Mundo', cover: 'img/6.jpg', images: ['img/album/album-dummy-6.jpg', 'img/album/album-dummy-4.jpg'] },
        { id: 'a7', title: 'Abstractos Modernos', cover: 'img/1.jpg', images: ['img/album/album-dummy-7.jpg', 'img/album/album-dummy-8.jpg'] },
        { id: 'a8', title: 'Fauna Silvestre', cover: 'img/2.jpg', images: ['img/album/album-dummy-8.jpg', 'img/album/album-dummy-7.jpg'] },
    ];


    // --- Funciones para Portafolios y Modales (mantener las existentes) ---
    // (renderPortfolios, openPortfolioModal, closePortfolioModal, renderGalleryImages, showCurrentSlide, changeSlide, renderComments)
    function renderPortfolios(portfolios) {
        if (!portfoliosGrid) return;
        portfoliosGrid.innerHTML = '';
        portfolios.forEach(portfolio => {
            const portfolioCard = document.createElement('div');
            portfolioCard.classList.add('portfolio-card');
            portfolioCard.dataset.id = portfolio.id;
            portfolioCard.innerHTML = `
    <img src="${portfolio.images[0].src}" alt="${portfolio.images[0].alt}">
        <h3>${portfolio.title}</h3>
        <p>${portfolio.artist}</p>
        `;
            portfolioCard.addEventListener('click', () => openPortfolioModal(portfolio));
            portfoliosGrid.appendChild(portfolioCard);
        });
    }

    function openPortfolioModal(portfolio) {
        if (!portfolioModal) return;
        modalPortfolioTitle.textContent = portfolio.title;
        modalPortfolioArtist.textContent = `Artista: ${portfolio.artist}`;
        currentPortfolioImages = portfolio.images;
        currentSlideIndex = 0;
        renderGalleryImages();
        renderComments(portfolio.comments);
        portfolioModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePortfolioModal() {
        if (!portfolioModal) return;
        portfolioModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderGalleryImages() {
        if (!modalGalleryInner || !modalGalleryDots) return;
        modalGalleryInner.innerHTML = '';
        modalGalleryDots.innerHTML = '';
        currentPortfolioImages.forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.classList.add('gallery-image');
            modalGalleryInner.appendChild(imgElement);

            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                showCurrentSlide();
            });
            modalGalleryDots.appendChild(dot);
        });
        showCurrentSlide();
    }

    function showCurrentSlide() {
        if (!modalGalleryInner || !modalGalleryDots) return;
        const images = modalGalleryInner.querySelectorAll('.gallery-image');
        const dots = modalGalleryDots.querySelectorAll('.dot');
        images.forEach((img, i) => {
            img.style.display = i === currentSlideIndex ? 'block' : 'none';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlideIndex);
        });
    }

    function changeSlide(n) {
        if (!currentPortfolioImages.length) return;
        currentSlideIndex = (currentSlideIndex + n + currentPortfolioImages.length) % currentPortfolioImages.length;
        showCurrentSlide();
    }

    function renderComments(comments) {
        if (!commentList) return;
        commentList.innerHTML = '';
        if (comments.length === 0) {
            commentList.innerHTML = '<p>Sé el primero en comentar.</p>';
            return;
        }
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-item');
            commentElement.innerHTML = `
        <p class="comment-author">${comment.author}</p>
        <p class="comment-text">${comment.text}</p>
        `;
            commentList.appendChild(commentElement);
        });
    }

    // --- Funciones para el Panel de Login (mantener las existentes) ---
    function openLoginPanel() {
        if (!loginPanel) return;
        loginPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        startLoginCarousel();
    }

    function closeLoginPanel() {
        if (!loginPanel) return;
        loginPanel.classList.remove('active');
        document.body.style.overflow = '';
        stopLoginCarousel();
        if (loginMessage) loginMessage.textContent = '';
    }

    function startLoginCarousel() {
        if (!loginCarousel) return;
        const images = loginCarousel.querySelectorAll('img');
        if (images.length === 0) return;
        let currentImageIndex = 0;

        function showNextImage() {
            images.forEach((img, index) => {
                img.style.display = index === currentImageIndex ? 'block' : 'none';
            });
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }

        showNextImage();
        loginCarouselInterval = setInterval(showNextImage, 3000);
    }

    function stopLoginCarousel() {
        if (loginCarouselInterval) {
            clearInterval(loginCarouselInterval);
            loginCarouselInterval = null;
        }
    }

    // --- Funciones de Tema Oscuro/Claro (mantener las existentes) ---
    function updateThemeToggleButtonText() {
        if (!themeToggleDropdown) return;
        if (document.body.classList.contains('dark-mode')) {
            themeToggleDropdown.textContent = 'Modo Claro';
        } else {
            themeToggleDropdown.textContent = 'Modo Oscuro';
        }
    }

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        updateThemeToggleButtonText();
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        updateThemeToggleButtonText();
    }

    // --- Lógica de Notificaciones (mantener las existentes) ---
    let unreadNotifications = 0;
    const allNotifications = [];

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

    function addNotification(typeKey, detailArgs, link = '#') {
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
        allNotifications.unshift(notification);
        if (!notification.read) {
            unreadNotifications++;
        }
        updateNotificationDisplay();
        if (notificationDropdown && notificationDropdown.classList.contains('active')) {
            renderNotifications();
        }
    }

    function updateNotificationDisplay() {
        if (!notificationCount) return;
        notificationCount.textContent = unreadNotifications > 0 ? unreadNotifications : '';
        notificationCount.style.display = unreadNotifications > 0 ? 'block' : 'none';
    }

    function renderNotifications() {
        if (!notificationList) return;
        notificationList.innerHTML = '';
        const notificationsToShow = allNotifications.slice(0, 5);

        if (notificationsToShow.length === 0) {
            notificationList.innerHTML = '<div class="notification-item no-notifications">No tienes notificaciones nuevas.</div>';
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
                markNotificationAsRead(n.id);
            });
            notificationList.appendChild(notificationItem);
        });
    }

    function markNotificationAsRead(id) {
        const notification = allNotifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            unreadNotifications--;
            updateNotificationDisplay();
            if (notificationDropdown && notificationDropdown.classList.contains('active')) {
                renderNotifications();
            }
        }
    }

    function getTimeAgo(date) {
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

    function simulateInitialNotifications() {
        allNotifications.length = 0;
        unreadNotifications = 0;

        addNotification('friendRequest', ['Ana López'], '#');
        addNotification('comment', ['Pedro R.', 'Mi Ciudad Soñada'], '#');
        addNotification('achievement', ['Tu obra "Danza de Colores" ha superado las 500 vistas'], '#');
        addNotification('friendRequest', ['María Fernández'], '#');
        addNotification('comment', ['Sofía P.', 'El Retrato de la Abuela'], '#');

        markNotificationAsRead(allNotifications[4].id);
        markNotificationAsRead(allNotifications[2].id);
        updateNotificationDisplay();
        renderNotifications();
    }


    // --- Lógica para mostrar/ocultar Dropdowns (mantener la existente) ---
    function toggleDropdown(dropdownElement) {
        document.querySelectorAll('.dropdown-menu.active').forEach(openDropdown => {
            if (openDropdown !== dropdownElement) {
                openDropdown.classList.remove('active');
            }
        });
        dropdownElement.classList.toggle('active');
    }

    // --- Funciones para el Sub-menú y la Sección de Álbumes ---

    /**
     * Alterna la visibilidad de las secciones de contenido.
     * @param {string} sectionId - El ID de la sección a mostrar (ej: 'albumsSection').
*/
    function showContentSection(sectionId) {
        // Oculta todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Muestra la sección deseada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Actualiza el estado activo de los botones del sub-menú
        subMenuButtons.forEach(button => {
            if (button.dataset.section === sectionId.replace('Section', '')) { // Eliminar 'Section' para coincidir con data-section
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Si la sección de portafolios es la activa, renderizar los portafolios
        if (sectionId === 'portfolioSection' && portfoliosGrid) {
            renderPortfolios(dummyPortfolios); // Reutiliza la función existente
        }
        // Si la sección de álbumes es la activa, renderizar los álbumes
        if (sectionId === 'albumsSection' && albumsGrid) {
            renderAlbums(dummyAlbums);
        }
    }

    /**
     * Renderiza los álbumes en la cuadrícula de álbumes.
     * @param {Array < Object >} albums - Array de objetos de álbum.
*/
    function renderAlbums(albums) {
        if (!albumsGrid) return;
        albumsGrid.innerHTML = ''; // Limpia la cuadrícula actual

        if (albums.length === 0) {
            albumsGrid.innerHTML = '<p>No hay álbumes para mostrar.</p>';
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
            albumsGrid.appendChild(albumCard);
        });

        // Añadir listeners a los botones de acción de los álbumes
        albumsGrid.querySelectorAll('.view-album').forEach(button => {
            button.addEventListener('click', (event) => {
                const albumId = event.currentTarget.dataset.albumId;
                alert(`Simulando ver álbum: ${albumId}`);
                // Aquí podrías abrir un modal con las imágenes del álbum
            });
        });

        albumsGrid.querySelectorAll('.edit-album').forEach(button => {
            button.addEventListener('click', (event) => {
                const albumId = event.currentTarget.dataset.albumId;
                alert(`Simulando editar álbum: ${albumId}`);
            });
        });

        albumsGrid.querySelectorAll('.share-album').forEach(button => {
            button.addEventListener('click', (event) => {
                const albumId = event.currentTarget.dataset.albumId;
                alert(`Simulando compartir álbum: ${albumId}`);
            });
        });

        albumsGrid.querySelectorAll('.delete-album').forEach(button => {
            button.addEventListener('click', (event) => {
                const albumId = event.currentTarget.dataset.albumId;
                if (confirm(`¿Estás seguro de que quieres eliminar el álbum ${albumId}?`)) {
                    alert(`Simulando eliminar álbum: ${albumId}`);
                    // Aquí podrías eliminar el álbum del array y volver a renderizar
                }
            });
        });
    }


    // --- Event Listeners (mantener los existentes y añadir los nuevos) ---
    // (Mantener listeners de header, modales, login panel)
    if (portfoliosGrid) {
        renderPortfolios(dummyPortfolios);
    }
    if (closePortfolioModalButton) closePortfolioModalButton.addEventListener('click', closePortfolioModal);
    if (portfolioModal) portfolioModal.addEventListener('click', (event) => {
        if (event.target === portfolioModal) {
            closePortfolioModal();
        }
    });
    if (prevImage) prevImage.addEventListener('click', () => changeSlide(-1));
    if (nextImage) nextImage.addEventListener('click', () => changeSlide(1));
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = e.target.querySelector('textarea');
            if (textarea.value.trim()) {
                alert('Comentario enviado: ' + textarea.value);
                textarea.value = '';
            }
        });
    }

    if (loginButton) loginButton.addEventListener('click', openLoginPanel);
    if (closeLoginPanelButton) closeLoginPanelButton.addEventListener('click', closeLoginPanel);
    if (loginPanel) loginPanel.addEventListener('click', (event) => {
        if (event.target === loginPanel && loginPanel.classList.contains('active')) {
            closeLoginPanel();
        }
    });
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const simulatedUsername = usernameInput ? usernameInput.value : 'Usuario';
            alert(`Simulando envío de formulario de login para ${simulatedUsername}`);
            closeLoginPanel();
        });
    }

    if (notificationButton) {
        notificationButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(notificationDropdown);
            allNotifications.forEach(n => n.read = true);
            unreadNotifications = 0;
            updateNotificationDisplay();
            renderNotifications();
        });
    }

    if (userProfileButton) {
        userProfileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(userProfileDropdown);
        });
    }

    if (themeToggleDropdown) {
        themeToggleDropdown.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
            if (userProfileDropdown) userProfileDropdown.classList.remove('active');
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            alert('Cerrar Sesión (simulado por el diseñador)');
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

    window.addEventListener('click', (event) => {
        if (notificationDropdown && !notificationDropdown.contains(event.target) && notificationButton && !notificationButton.contains(event.target)) {
            notificationDropdown.classList.remove('active');
        }
        if (userProfileDropdown && !userProfileDropdown.contains(event.target) && userProfileButton && !userProfileButton.contains(event.target)) {
            userProfileDropdown.classList.remove('active');
        }
        if (portfolioModal && event.target === portfolioModal) {
            closePortfolioModal();
        }
        if (loginPanel && event.target === loginPanel && loginPanel.classList.contains('active')) {
            closeLoginPanel();
        }
    });

    // --- Nuevos Event Listeners para el Sub-menú ---
    subMenuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const section = event.target.dataset.section; // Obtiene el valor de data-section
            showContentSection(`${section}Section`); // Construye el ID de la sección (ej. 'albumsSection')
        });
    });


    // --- Inicialización al cargar la página ---
    if (portfoliosGrid) {
        renderPortfolios(dummyPortfolios); // Esto carga los portfolios destacados por defecto
    }

    if (loginPanel && loginPanel.classList.contains('active')) {
        startLoginCarousel();
    } else if (loginPanel) {
        stopLoginCarousel();
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    updateThemeToggleButtonText();

    simulateInitialNotifications();

    // Mostrar la sección de Álbumes por defecto al cargar la página
    showContentSection('albumsSection'); // Asegura que "Álbumes" es la vista inicial
});
