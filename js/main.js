import '../less/main.less';

// Función principal
document.addEventListener('DOMContentLoaded', () => {
  const mySlider = new SliderController();
  setupMobileMenu();
  setupDonationButtons();
  setupRegisterButtons();
  setupAppointmentButtons();
  setupFormValidation();
});



// Menú móvil
function setupMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.createElement('button');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '☰';

  if (window.innerWidth <= 768) {
    document.querySelector('.main-nav').prepend(hamburger);
    navLinks.style.display = 'none';

    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'none' ? 'flex' : 'none';
    });
  }
}

// Botones de donación
function setupDonationButtons() {
  const amountButtons = document.querySelectorAll('.amount-btn');
  amountButtons.forEach(button => {
    button.addEventListener('click', () => {
      amountButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

// Botones de registro de eventos
function setupRegisterButtons() {
  const registerButtons = document.querySelectorAll('.register-btn');
  registerButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('¡Registro exitoso! Te enviaremos más información por correo electrónico.');
    });
  });
}

// Botones de cita para servicios
function setupAppointmentButtons() {
  const appointmentButtons = document.querySelectorAll('.cta-button');
  appointmentButtons.forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = '/contacto.html';
    });
  });
}

// Validación del formulario
function setupFormValidation() {
  const form = document.querySelector('#contactForm');
  const nameInput = document.querySelector('#name');
  const phoneInput = document.querySelector('#phone');
  const emailInput = document.querySelector('#email');
  const messageInput = document.querySelector('#message');

  nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''); 
    nameInput.setCustomValidity(
      nameInput.value.trim().length < 5
        ? 'El nombre debe tener al menos 5 caracteres y solo puede contener letras.'
        : ''
    );
  });


  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, ''); 
    phoneInput.setCustomValidity(
      phoneInput.value.length !== 8
        ? 'El número de teléfono debe contener exactamente 8 dígitos.'
        : ''
    );
  });

  emailInput.addEventListener('input', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailInput.setCustomValidity(
      !emailRegex.test(emailInput.value)
        ? 'Por favor, introduce un correo electrónico válido.'
        : ''
    );
  });


  messageInput.addEventListener('input', () => {
    messageInput.setCustomValidity(
      messageInput.value.trim().length < 10
        ? 'El mensaje debe tener al menos 10 caracteres.'
        : ''
    );
  });

  
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault(); 
      form.reportValidity();
    } else {
      alert('¡Gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.');
      form.reset(); 
    }
  });
}

class SliderController {
  constructor() {
    this.slider = document.querySelector('.slider');
    this.framestack = document.querySelector('.frametrack');
    this.slides = [...document.querySelectorAll('.frametrack .slide')];
    this.currentSlide = 0;
    this.slideDirection = 1;
    this.intervalTime = 8000;

    if (!this.slider || !this.framestack || this.slides.length === 0) {
      console.error('Estructura del slider no encontrada.');
      return;
    }

    this.generateUI();
    this.moveToSlide(0);
  }

  moveToSlide(slideIndex) {
    clearTimeout(this.intervalId);
    this.currentSlide = slideIndex;
    this.framestack.style.left = `-${this.currentSlide * 100}vw`;
    this.updateNavigation();
    this.tick();
  }

  tick() {
    this.intervalId = setTimeout(() => this.moveToNext(), this.intervalTime);
  }

  moveToNext() {
    if (this.currentSlide + this.slideDirection >= this.slides.length || this.currentSlide + this.slideDirection < 0) {
      this.slideDirection *= -1;
    }
    this.moveToSlide(this.currentSlide + this.slideDirection);
  }

  updateNavigation() {
    document.querySelectorAll('.navigation-index').forEach((nav, i) => {
      nav.classList.toggle('active', i === this.currentSlide);
    });
  }

  generateUI() {
    const btnRight = this.createButton('&gt;', 'navigate-right', () => {
      this.slideDirection = 1;
      this.moveToNext();
    });

    const btnLeft = this.createButton('&lt;', 'navigate-left', () => {
      this.slideDirection = -1;
      this.moveToNext();
    });

    this.slider.append(btnLeft, btnRight);

    const navContainer = document.createElement('div');
    navContainer.classList.add('navigation-container');

    this.slides.forEach((_, i) => {
      const navIndex = document.createElement('div');
      navIndex.classList.add('navigation-index');
      navIndex.addEventListener('click', () => this.moveToSlide(i));
      navContainer.appendChild(navIndex);
    });

    this.slider.appendChild(navContainer);
    this.updateNavigation();
  }

  createButton(innerHTML, className, onClick) {
    const button = document.createElement('div');
    button.innerHTML = innerHTML;
    button.classList.add('navigation-btn', className);
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return button;
  }
}
