import '@/components/layouts/default-layout-sidebar.ce.js';
import '@/components/layouts/default-layout-main.ce.js';
import { redirectTo } from '@/router.js';

class ViewDash extends HTMLElement {
  connectedCallback() {
    this.verifyUserLoggedIn();
  }

  verifyUserLoggedIn() {
    // URL de la vue Django pour vérifier si l'utilisateur est connecté
    const url = 'http://127.0.0.1:8001/accounts/is_user_logged_in/';

    const response = fetch(url, {
      method: 'GET',
      credentials: 'include', // Pour inclure les cookies dans la requête
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(data.username);
          console.log(data.email);
          // L'utilisateur est connecté, utiliser les données reçues
          const username = data.username;
          const email = data.email;
          // Afficher le contenu du tableau de bord avec le nom d'utilisateur
          this.displayDashboard(username);
        } else {
          // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
          alert('Veuillez vous connecter.');
          redirectTo('/login');
        }
      })
      .catch(error => {
        console.error("Erreur lors de la vérification de l'état de connexion:", error);
      });
  }

  displayDashboard(username) {
    this.innerHTML = `
      <default-layout-sidebar></default-layout-sidebar>
      <default-layout-main>
        <div class="dashboard-content">
          <div class="dashboard-text">
              <h1>TRANSCENDANCE PONG</h1>
          </div>
          <h2>Bienvenue, ${username}</h2>
          <div class="big-button-play">
            <button type="button" class="btn btn-outline-light btn-lg">Play Now</button>
          </div>
        </div>
        <div id="supp">
          <a href="#" id="delete-account-link">
            <h3> supprimer le compte</h3>
          </a>
        </div>
      </default-layout-main>
    `;
    this.querySelector('#delete-account-link').addEventListener('click', event => {
      event.preventDefault();
      this.suppUser(username);
    });
  }

  async suppUser(username) {
    const url = `http://127.0.0.1:8001/accounts/delete_user/${username}`;
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': this.getCSRFToken(),
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          redirectTo('/');
        }
      })
      .catch(error => console.error('Error:', error));
  }
  getCSRFToken() {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      .split('=')[1];
  }
}

customElements.define('view-dash', ViewDash);
