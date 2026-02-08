// Основной JavaScript файл для форума

document.addEventListener('DOMContentLoaded', function () {
  console.log('Standoff 2 Forum loaded successfully!');

  // ===== ПЕРЕМЕННЫЕ =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const statNumbers = document.querySelectorAll('.stat-number');

  // ===== МОБИЛЬНОЕ МЕНЮ =====
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function () {
      mainNav.classList.toggle('active');
      this.innerHTML = mainNav.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // ===== КНОПКА "НАВЕРХ" =====
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== АНИМАЦИЯ СТАТИСТИКИ =====
  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000; // 2 секунды
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current).toLocaleString();
      }, 16);
    });
  }

  // Запускаем анимацию статистики при загрузке
  if (statNumbers.length > 0) {
    // Ждем немного, чтобы страница загрузилась
    setTimeout(animateStats, 500);
  }

  // ===== АНИМАЦИЯ ПРИ ПРОКРУТКЕ =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Наблюдаем за элементами для анимации
  document.querySelectorAll('.category-card, .feature-card, .topic-item').forEach(el => {
    observer.observe(el);
  });

  // ===== ИНТЕРАКТИВНЫЕ КАРТОЧКИ =====
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ===== ФИКСИРОВАННЫЙ НАВБАР ПРИ ПРОКРУТКЕ =====
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Прокрутка вниз
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Прокрутка вверх
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  });

  // ===== ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ В НАВБАРЕ =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function highlightNavLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);

  // ===== ТЕМА (СВЕТЛАЯ/ТЕМНАЯ) - ДЛЯ БУДУЩЕГО РАСШИРЕНИЯ =====
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.title = 'Переключить тему';

  themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
      icon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      icon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Проверяем сохраненную тему
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Добавляем кнопку переключения темы в навбар
  if (document.querySelector('.auth-section')) {
    document.querySelector('.auth-section').prepend(themeToggle);
  }

  // ===== ДОБАВЛЯЕМ CSS ДЛЯ ТЕМНОЙ/СВЕТЛОЙ ТЕМЫ =====
  const style = document.createElement('style');
  style.textContent = `
        .light-theme {
            background-color: #f8f9fa;
            color: #333;
        }

        .light-theme .navbar {
            background: rgba(248, 249, 250, 0.95);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .light-theme .nav-link {
            color: #555;
        }

        .light-theme .nav-link:hover {
            color: #000;
            background: rgba(0, 0, 0, 0.05);
        }

        .light-theme .category-card,
        .light-theme .feature-card,
        .light-theme .auth-card {
            background: white;
            border-color: rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .theme-toggle {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .light-theme .theme-toggle {
            border-color: rgba(0, 0, 0, 0.2);
            color: #333;
        }

        .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: rotate(30deg);
        }
    `;
  document.head.appendChild(style);

  // ===== СООБЩЕНИЕ ОБ УСПЕШНОЙ ЗАГРУЗКЕ =====
  console.log('Все скрипты успешно загружены!');
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

  document.body.appendChild(notification);

  // Анимация появления
  setTimeout(() => notification.classList.add('show'), 100);

  // Закрытие по кнопке
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });

  // Автоматическое закрытие через 5 секунд
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Добавляем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 9999;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left: 4px solid #43e97b;
    }

    .notification.error {
        border-left: 4px solid #ff4757;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification.success i {
        color: #43e97b;
    }

    .notification.error i {
        color: #ff4757;
    }

    .notification-close {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1rem;
    }

    .notification-close:hover {
        color: #333;
    }
`;
document.head.appendChild(notificationStyles);
