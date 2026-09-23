/**
 * Lógica Frontend - Arquitectura Modular y Accesibilidad WAI-ARIA
 * Portafolio Técnico de Thomas Cortés
 */
'use strict';

class PortfolioController {
  constructor() {
    this.initTabs();
    this.initCopyEmail();
  }

  /**
   * Manejo accesible de pestañas (WAI-ARIA Tabs pattern)
   */
  initTabs() {
    const tabList = document.querySelector('.tab-list');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll('.tab-btn');
    const flagshipCard = document.querySelector('.project-flagship-card');
    const secondaryCards = document.querySelectorAll('.secondary-card');

    const filterProjects = (filter) => {
      // Filtrar tarjeta Flagship
      if (flagshipCard) {
        const cat = flagshipCard.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          flagshipCard.style.display = 'grid';
        } else {
          flagshipCard.style.display = 'none';
        }
      }

      // Filtrar tarjetas secundarias
      secondaryCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    tabs.forEach((tab, index) => {
      // Evento de clic
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        const filter = tab.getAttribute('data-filter');
        filterProjects(filter);
      });

      // Navegación por teclado (Flechas Izquierda / Derecha)
      tab.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          tabs[targetIndex].focus();
          tabs[targetIndex].click();
        }
      });
    });
  }

  /**
   * Copiar correo electrónico con retroalimentación visual accesible
   */
  initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const feedback = document.getElementById('copy-feedback');
    if (!copyBtn || !feedback) return;

    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 't.cortes@example.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback para entornos locales sin HTTPS estricto
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        feedback.textContent = `✓ Correo (${email}) copiado al portapapeles.`;
        feedback.style.color = 'var(--accent-green)';
        
        setTimeout(() => {
          feedback.textContent = '';
        }, 3500);
      } catch (err) {
        feedback.textContent = `Error al copiar. Correo: ${email}`;
        feedback.style.color = '#EF4444';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioController();
});