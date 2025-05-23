document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const portfoliosGrid = document.getElementById('portfolios-grid');
    const portfolioModal = document.getElementById('portfolioModal');
    const closePortfolioModalButton = document.getElementById('closePortfolioModalButton');
    const modalPortfolioTitle = document.getElementById('modalPortfolioTitle');
    const modalPortfolioArtist = document.getElementById('modalPortfolioArtist');
    const modalGalleryTrack = document.getElementById('modalGallery');
    const carouselPrevBtn = document.getElementById('carouselPrevBtn');
    const carouselNextBtn = document.getElementById('carouselNextBtn');
    const carouselDotsContainer = document.getElementById('carouselDots');

    // Elementos del modo oscuro
    const themeToggleButton = document.getElementById('themeToggleButton');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Nuevos elementos para el Login Panel
    const loginPanel = document.getElementById('loginPanel'); // Referencia al nuevo panel
    const closeLoginPanelButton = document.getElementById('closeLoginPanelButton'); // Nuevo ID específico
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    const loggedInUserDisplay = document.getElementById('loggedInUserDisplay');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const loginArtImage = document.getElementById('loginArtImage'); // La imagen dentro del panel


    let currentSlideIndex = 0;
    let currentPortfolioImages = [];
    let isLoggedIn = false; // Estado de login

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
    //gggggggggggggggggggg





    //ggggggggggggg

    function renderPortfolios(portfolios) {
        portfoliosGrid.innerHTML = '';
        portfolios.forEach(portfolio => {
            const card = document.createElement('div');
            card.classList.add('portfolio-card');
            card.innerHTML = `
                <img src="${portfolio.thumbnail}" alt="Miniatura de ${portfolio.portfolioTitle}" class="portfolio-thumbnail">
                <h3>${portfolio.artistName}</h3>
                <p>${portfolio.portfolioTitle}</p>
                <span class="view-portfolio" data-portfolio-id="${portfolio.id}">Ver Portafolio</span>
            `;
            portfoliosGrid.appendChild(card);
        });
    }

    function openPortfolioModal(portfolio) {
        modalPortfolioTitle.textContent = portfolio.portfolioTitle;
        modalPortfolioArtist.textContent = `De: ${portfolio.artistName}`;
        modalGalleryTrack.innerHTML = '';
        carouselDotsContainer.innerHTML = '';

        currentPortfolioImages = portfolio.images;
        currentSlideIndex = 0;

        portfolio.images.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Imagen ${index + 1} del portafolio`;
            modalGalleryTrack.appendChild(img);

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slideIndex = index;
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
            carouselDotsContainer.appendChild(dot);
        });

        updateCarousel();
        portfolioModal.style.display = 'flex';
        body.style.overflow = 'hidden'; // Evita el scroll del body cuando el modal está abierto
    }

    function closePortfolioModal() {
        portfolioModal.style.display = 'none';
        body.style.overflow = ''; // Restaura el scroll del body
    }

    function updateCarousel() {
        const offset = -currentSlideIndex * 100;
        modalGalleryTrack.style.transform = `translateX(${offset}%)`;

        const dots = carouselDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function moveToSlide(index) {
        if (index < 0) {
            currentSlideIndex = currentPortfolioImages.length - 1;
        } else if (index >= currentPortfolioImages.length) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex = index;
        }
        updateCarousel();
    }

    // --- Lógica del Modo Oscuro ---
    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = 'Modo Claro';
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggleButton.textContent = 'Modo Oscuro';
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    /*   // --- Lógica del Login Panel (Nuevo) ---
      function openLoginPanel() {
          loginPanel.classList.add('active'); // Activa la clase para mostrarlo
          body.style.overflow = 'hidden'; // Evita el scroll del body
          loginMessage.textContent = ''; // Limpia mensajes anteriores
          loginMessage.classList.remove('success'); // Asegura que no tenga clase éxito
          loginForm.reset(); // Resetea el formulario
          usernameInput.focus(); // Enfoca el primer campo
  
          // Opcional: Cargar una imagen aleatoria para el login si tienes más de una
          const randomImageIndex = Math.floor(Math.random() * dummyPortfolios.length);
          loginArtImage.src = dummyPortfolios[randomImageIndex].thumbnail;
          loginArtImage.alt = `Arte de ${dummyPortfolios[randomImageIndex].artistName}`;
      }
  
      function closeLoginPanel() {
          loginPanel.classList.remove('active'); // Quita la clase para ocultarlo
          body.style.overflow = ''; // Restaura el scroll del body
      }
  
      function handleLogin(event) {
          event.preventDefault(); // Evita que el formulario se envíe realmente
  
          const username = usernameInput.value;
          const password = passwordInput.value;
  
          // Simulación de validación de login
          if (username === 'user' && password === 'password') {
              loginMessage.textContent = '¡Inicio de sesión exitoso!';
              loginMessage.style.color = 'green'; // Directamente
              loginMessage.classList.add('success'); // Para posibles estilos CSS
              isLoggedIn = true;
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('loggedInUsername', username);
              updateLoginState();
              setTimeout(() => {
                  closeLoginPanel(); // Cierra el panel después de 1 segundo
              }, 1000);
          } else {
              loginMessage.textContent = 'Usuario o contraseña incorrectos.';
              loginMessage.style.color = 'red';
              loginMessage.classList.remove('success');
              isLoggedIn = false;
          }
      }
  
      function handleLogout() {
          isLoggedIn = false;
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('loggedInUsername');
          updateLoginState();
          alert('Sesión cerrada.');
      }
  
      function updateLoginState() {
          if (isLoggedIn) {
              loginButton.style.display = 'none';
              loggedInUserDisplay.style.display = 'flex';
              usernameDisplay.textContent = localStorage.getItem('loggedInUsername');
          } else {
              loginButton.style.display = 'block';
              loggedInUserDisplay.style.display = 'none';
              usernameDisplay.textContent = '';
          }
      } */


    const loginImageContainer = document.querySelector('.login-image-container');
    const loginImages = [
        "img/login/1.jpg",
        "img/login/2.jpg",
        "img/login/3.jpg"
    ];
    let currentLoginImageIndex = 0;
    let loginImageInterval; // Para almacenar el ID del intervalo del slide

    // ... (mantener tus arrays dummyPortfolios y variables de estado) ...

    // --- Lógica del Login Panel (Modificaciones para el carrusel) ---
    function openLoginPanel() {
        loginPanel.classList.add('active');
        body.style.overflow = 'hidden';
        loginMessage.textContent = '';
        loginMessage.classList.remove('success');
        loginForm.reset();
        usernameInput.focus();

        // Limpiar imágenes anteriores para evitar duplicados si se abre varias veces
        loginImageContainer.innerHTML = '';

        // Crear y añadir las imágenes al contenedor
        loginImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Imagen de login ${index + 1}`;
            img.classList.add('login-slide-image'); // Clase para identificar las imágenes
            loginImageContainer.appendChild(img);
        });

        currentLoginImageIndex = 0; // Resetear al inicio
        showLoginSlide(currentLoginImageIndex); // Mostrar la primera imagen

        // Iniciar el intervalo para el cambio de diapositivas
        // Ajusta el tiempo (en milisegundos) según lo que prefieras
        loginImageInterval = setInterval(nextLoginSlide, 4000); // Cambia cada 4 segundos
    }

    function closeLoginPanel() {
        loginPanel.classList.remove('active');
        body.style.overflow = '';
        clearInterval(loginImageInterval); // Detener el intervalo cuando se cierra el panel
        loginImageContainer.innerHTML = ''; // Limpiar las imágenes al cerrar
    }

    function showLoginSlide(index) {
        const slides = loginImageContainer.querySelectorAll('.login-slide-image');
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });
    }

    function nextLoginSlide() {
        currentLoginImageIndex = (currentLoginImageIndex + 1) % loginImages.length;
        showLoginSlide(currentLoginImageIndex);
    }

    // ... (mantener handleLogin, handleLogout, updateLoginState) ...

    // --- Event Listeners (mantener los existentes) ---
    // ...
    closeLoginPanelButton.addEventListener('click', closeLoginPanel);

    window.addEventListener('click', (event) => {
        if (event.target === portfolioModal) {
            closePortfolioModal();
        }
        if (event.target === loginPanel && loginPanel.classList.contains('active')) {
            closeLoginPanel();
        }
    });




    // --- Event Listeners ---
    loginButton.addEventListener('click', openLoginPanel); // Cambiado a openLoginPanel

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        alert(`Buscando: "${query}" (Aquí iría la llamada a tu API de búsqueda)`);
    });

    portfoliosGrid.addEventListener('click', (event) => {
        const viewPortfolioSpan = event.target.closest('.view-portfolio');
        if (viewPortfolioSpan) {
            const portfolioId = parseInt(viewPortfolioSpan.dataset.portfolioId);
            const selectedPortfolio = dummyPortfolios.find(p => p.id === portfolioId);
            if (selectedPortfolio) {
                openPortfolioModal(selectedPortfolio);
            }
        }
    });

    // Cierre de modales/paneles
    closePortfolioModalButton.addEventListener('click', closePortfolioModal);
    closeLoginPanelButton.addEventListener('click', closeLoginPanel); // Cambiado a closeLoginPanel

    // Listener para cerrar al hacer clic fuera (solo si el panel está activo)
    window.addEventListener('click', (event) => {
        if (event.target === portfolioModal) { // Cierra el modal de galería
            closePortfolioModal();
        }
        // Para el login panel: cerrar si se hace clic en el fondo transparente
        if (event.target === loginPanel && loginPanel.classList.contains('active')) {
            closeLoginPanel();
        }
    });

    carouselPrevBtn.addEventListener('click', () => {
        moveToSlide(currentSlideIndex - 1);
    });

    carouselNextBtn.addEventListener('click', () => {
        moveToSlide(currentSlideIndex + 1);
    });

    themeToggleButton.addEventListener('click', toggleTheme);

    // Listener para el envío del formulario de login
    //loginForm.addEventListener('submit', handleLogin);

    // Listener para el botón de cerrar sesión
    //logoutButton.addEventListener('click', handleLogout);

    // --- Inicialización al cargar la página ---
    renderPortfolios(dummyPortfolios);

    // Comprobar la preferencia de tema guardada en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Comprobar estado de login al cargar la página
    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
    }
    updateLoginState(); // Actualiza el UI según el estado de login
});