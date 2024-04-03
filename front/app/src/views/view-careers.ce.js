import { redirectTo } from '@/router.js';
import '@/components/layouts/default-layout/default-layout-sidebar.ce.js';
import '@/components/layouts/default-layout/default-layout-main.ce.js';
import { user, isAuthenticated } from '@/auth.js';

class ViewCareers extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <default-layout-sidebar></default-layout-sidebar>
      <default-layout-main>
        <h1 class="display-5 fw-bold mb-4 text-center mt-md-n5 mt-0">
          Statistic
        </h1>

        <!-- avatar and classement -->

        <div class="d-flex align-items-center">
          <div class="flex-shrink-0 flex-grow-0">
            <img src="${user.avatar}" class="img-thumbnail rounded-circle" alt="character" style="width: 128px; height: 128px; object-fit: cover;">
          </div>
          <div class="flex-shrink-1 flex-grow-1 text-truncate">
            <h1 class="display-5 fw-bold mb-4 text-center text-lg irish-grover extra-large">
              ${user.id} / ${user.nbtotal}
            </h1>
          </div>
        </div>

        <!-- Nom et RANK -->

        <div class="row">
          <div class="col-md-6">
            <h3 class="display-5 fw-bold btn-lg ms-5">
              ${user.username}
            </h3>
          </div>
          <div class="col-md-6">
            <a class="btn btn-outline-primary border-2 fw-semibold rounded-pill btn-lg fs-2" style="--bs-btn-color: var(--bs-body-color);" href="#" data-link="/rank">
              <span class="d-inline-block py-1">
              <img src="assets/img/rank-icon.png" alt="logo_rank" style="width: 50px; height: 50px; margin-right: 10px;">
              RANK
              </span>
            </a>
          </div>
        </div>

        <!-- Victories and Lost -->

        <div class="row mt-2">
          <div class="col-md-6">
            <div class="text-grey ms-4">
              <h2>
                Victories
              </h2>
            </div>
            <div class="btn border border-white rounded-pill btn-lg pe-none fs-2">
              <span class="d-inline-block py-1">
                <img src="assets/img/rank-icon.png" alt="logo_victories" style="width: 50px; height: 50px;">
                <span class="ms-2 me-3">${user.victories}</span>
              </span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="text-grey ms-5">
              <h2>
                Lost
              </h2>
            </div>
            <div class="btn border border-white rounded-pill btn-lg pe-none fs-2">
              <span class="d-inline-block py-1">
                <img src="assets/img/lost-icon.png" alt="logo_lost" style="width: 50px; height: 50px;">
                <span class="ms-2 me-3">${user.lost}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Online and Local -->

        <div class="row mt-2">
          <div class="col-md-6">
            <div class="text-grey ms-4">
              <h2>
                Online
              </h2>
            </div>
            <div class="btn border border-white rounded-pill btn-lg pe-none fs-2">
              <span class="d-inline-block py-1">
                <img src="assets/img/online-icon.png" alt="logo_online" style="width: 50px; height: 50px;">
                <span class="ms-2 me-3">${user.online}</span>
              </span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="text-grey ms-5">
              <h2>
                Local
              </h2>
            </div>
            <div class="btn border border-white rounded-pill btn-lg pe-none fs-2">
              <span class="d-inline-block py-1">
                <img src="assets/img/local-icon.png" alt="logo_local" style="width: 50px; height: 50px;">
                <span class="ms-2 me-3">${user.local}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Time play -->

        <div class="row">
        <div class="col-md-8 text-center text-grey">
          <h2>
            Time play
          </h2>
        </div>
        </div>

        <div class="row mt-2">
        <div class="col-md-8 d-flex justify-content-center">
          <div class="btn border border-white rounded-pill btn-lg pe-none fs-2">
            <span class="d-inline-block py-1">
              <img src="assets/img/timeplay-icon.png" alt="logo_local" style="width: 50px; height: 50px;">
              <span class="ms-2 me-3">${user.timeplay}H</span>
            </span>
          </div>
        </div>
        </div>


      </default-layout-main>
    `;
  }

  
}
customElements.define('view-careers', ViewCareers);
