import logoSvg from '@/assets/img/logo.svg?raw';
import { toggleTheme } from '@/theme.js';
import '@/game/components/game-demo.ce.js';
import { isAuthenticated, getProfile, logout, getCsrfToken, user, handleOAuthResponse } from '@/auth.js';
import { redirectTo } from '@/router.js';

class ViewWelcome extends HTMLElement {
  async connectedCallback() {
    const isLoggedIn = await isAuthenticated();
    let authMenuHtml;

    if (isLoggedIn) {
      const user = getProfile();
      authMenuHtml = `
        <li class="nav-item mx-lg-2">
          <a class="nav-link" href="#" data-link="/dashboard">Dashboard</a>
        </li>
        <li class="nav-item mx-lg-2">
          <a class="nav-link logout" href="#">Log out</a>
        </li>
        <li class="nav-item mx-lg-2">
          <a class="nav-link d-flex align-items-center" href="#" data-link="/profile">
            <div class="flex-shrink-0 flex-grow-0">
              <img src="${user.avatar}" class="d-block object-fit-cover rounded-circle m-n1" width="28" height="28" alt="${user.username}">
            </div>
            <span class="ms-2 ps-2 flex-shrink-1 flex-grow-1 text-truncate d-lg-none">${user.username}</span>
          </a>
        </li>
      `;
    } else {
      authMenuHtml = `
        <li class="nav-item mx-lg-2">
          <a class="nav-link" href="#" data-link="/login">Log in</a>
        </li>
        <li class="nav-item mx-lg-2">
          <a class="nav-link" href="#" data-link="/signup">Sign up</a>
        </li>
      `;
    }

    this.innerHTML = `
      <nav class="navbar navbar-expand-lg fixed-top z-2">
        <div class="container-fluid">
          <a class="navbar-brand d-flex" href="#" data-link="/">
            ${logoSvg}
          </a>
          <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvas">
            <ui-icon name="menu" class="fs-3"></ui-icon>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvas"
            aria-labelledby="offcanvasLabel"
            style="--bs-offcanvas-width: 15rem; --bs-offcanvas-border-color: rgba(var(--bs-dark-rgb), 0.25);"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasLabel">MENU</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end align-items-lg-center flex-grow-1 pe-2">
                ${authMenuHtml}
                <li class="nav-item mx-lg-2 py-2 py-lg-1 col-12 col-lg-auto">
                  <div class="navbar-text p-0 vr d-none d-lg-flex h-100 y-2 mx-2"></div>
                  <hr class="navbar-text p-0 d-lg-none my-2">
                </li>
                <li class="nav-item mx-lg-2">
                  <a class="nav-link p-0 theme-toggle" href="#">
                    <span class="fs-4">
                      <ui-icon name="moon" class="dark-visible"></ui-icon>
                      <ui-icon name="sun" class="dark-hidden"></ui-icon>
                    </span>
                    <span class="ms-2 d-lg-none">Toggle theme</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <section class="min-vh-100 d-flex flex-column pt-5 halo-bicolor">
        <div class="my-auto"></div>
        <div class="my-auto"></div>
        <div class="container text-center py-4">
          <h1 class="display-4 fw-bold mb-4">
            Ultimate <span class="text-bicolor">Pong</span> Game 
          </h1>
          <p class="fs-4 fw-semibold mb-4">
            Engage in the classic battle with friends or solo, online and offline.
          </p>
          <p class="pt-3">
            <a class="btn btn-primary px-sm-5 py-sm-3 fw-bold" href="#" data-link="/game">
              Play now
            </a>
          </p>
        </div>
        <div class="my-auto"></div>
        <div>

        <div class="d-flex justify-content-center">
          <game-demo class="w-100" style="max-width: 50rem;"></game-demo>
        </div>
      </section>
      
    `;

    this.querySelector('.theme-toggle')?.addEventListener('click', e => {
      e.preventDefault();
      toggleTheme();
    });

    this.querySelector('.logout')?.addEventListener('click', e => {
      e.preventDefault();
      this.handleLogout();
    });
  }

  async handleLogout() {
    await logout();
    redirectTo('/');
  }
}

customElements.define('view-welcome', ViewWelcome);
