import './default-layout-sidebar.ce.scss';
import logoSvg from '@/assets/img/logo.svg?raw';
import { toggleTheme } from '@/theme.js';
import { redirectTo } from '@/router.js';
import { logout, getProfile } from '@/auth.js';

class DefaultLayoutSidebar extends HTMLElement {
  connectedCallback() {
    const user = getProfile();
    this.innerHTML = `
      <header
        class="navbar fixed-top z-2 z-lg-n1 bg-body-secondary py-0"
        style="height: 3rem;"
      >
        <div class="container-fluid">
          <a href="#" data-link="/dashboard">
            ${logoSvg}
          </a>
          <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
            <ui-icon name="menu" class="fs-3"></ui-icon>
          </button>
        </div>
      </header>
      
      <div
        class="offcanvas-lg offcanvas-start bg-body-secondary border-0"
        tabindex="-1"
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
        style="--bs-offcanvas-width: 15rem;"
      >
        <div class="offcanvas-header px-4 z-3">
          <h5 class="offcanvas-title" id="offcanvasSidebarLabel">MENU</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasSidebar" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0">
          <nav
            class="
              nav nav-pills
              d-flex flex-column flex-nowrap bg-body-secondary
              h-100 p-4
              overflow-auto
              position-lg-fixed top-0 start-0 bottom-0
            "
            style="
              --bs-nav-link-color: var(--bs-body-color);
              --bs-nav-link-hover-color: var(--bs-primary);
              width: var(--bs-offcanvas-width);
            "
          >
            <div class="d-none d-lg-flex mb-4">
              <a href="#" data-link="/dashboard">
                ${logoSvg}
              </a>
            </div>
            <div class="d-grid mb-3">
              <a
                class="btn btn-outline-primary border-2 fw-semibold rounded-0"
                style="--bs-btn-color: var(--bs-body-color);"
                href="#"
                data-link="/game"
              >
                <span class="d-inline-block py-1">Start a Game</span>
              </a>
            </div>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center" href="#" data-link="/dashboard">
                <ui-icon class="fs-5 me-2 flex-shrink-0 flex-grow-0" name="dashboard"></ui-icon>
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Home</span>
              </a>
            </li>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center" href="#" data-link="/friends">
                <ui-icon class="fs-5 me-2 flex-shrink-0 flex-grow-0" name="friends"></ui-icon> 
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Friends</span>
              </a>
            </li>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center" href="#" data-link="/careers">
                <ui-icon class="fs-5 me-2 flex-shrink-0 flex-grow-0" name="carrers"></ui-icon> 
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Careers</span>
              </a>
            </li>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center" href="#" data-link="/settings">
                <ui-icon class="fs-5 me-2 flex-shrink-0 flex-grow-0" name="settings"></ui-icon>
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Settings</span>
              </a>
            </li>
            <span class="my-auto"></span>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center theme-toggle" href="#">
                <span class="fs-5 me-2 flex-shrink-0 flex-grow-0">
                  <ui-icon name="moon" class="dark-visible"></ui-icon>
                  <ui-icon name="sun" class="dark-hidden"></ui-icon>
                </span>
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Toggle theme</span>
              </a>
            </li>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center logout" href="#">
                <ui-icon class="fs-5 me-2 flex-shrink-0 flex-grow-0" name="logout"></ui-icon>
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">Log out</span>
              </a>
            </li>
            <li class="nav-item my-1">
              <a class="nav-link d-flex align-items-center" href="#" data-link="/profile">
                <div class="me-2 flex-shrink-0 flex-grow-0">
                  <img
                    src="${user.avatar}" 
                    class="d-block object-fit-cover rounded-circle m-n1"
                    width="28"
                    height="28"
                  />
                </div>
                <span class="ps-2 flex-shrink-1 flex-grow-1 text-truncate">${user.username}</span>
              </a>
            </li>
          </nav>
        </div>
      </div>
    `;

    this.querySelector('.theme-toggle')?.addEventListener('click', e => {
      e.preventDefault();
      toggleTheme();
    });

    this.querySelector('.logout').addEventListener('click', e => {
      e.preventDefault();
      this.handleLogout();
    });
  }

  async handleLogout() {
    await logout();
    localStorage.setItem('isLogged', 'false');
    redirectTo('/');
  }
}

customElements.define('default-layout-sidebar', DefaultLayoutSidebar);
