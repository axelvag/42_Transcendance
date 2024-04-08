import { getProfile } from '@/auth.js';
import { redirectTo } from '@/router.js';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

class ViewGameOnlineMatchmaking extends HTMLElement {
  #ws;

  constructor() {
    super();
    this.handleError = this.handleError.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

    const user = getProfile();
    this.#ws = new WebSocket(`${WS_BASE_URL}:8009/search-opponent/${user.id}`);
    this.#ws.onerror = this.handleError;
    this.#ws.onmessage = this.handleMessage;
    this.#ws.onopen = () => console.log('WebSocket opened');
    this.#ws.onclose = () => {
      console.log('WebSocket closed');
      this.#ws = null;
    };
  }
  async connectedCallback() {
    this.innerHTML = `
      <div class="vh-100 overflow-auto halo-bicolor d-flex flex-column p-2">
        <div class="d-flex">
          <a
            href="#"
            class="d-inline-block link-body-emphasis link-opacity-75 link-opacity-100-hover fs-4 m-3 btn-back"
            title="Back"
            data-link="/game"
          >
            <ui-icon name="arrow-left" class="me-2"></ui-icon>
          </a>
        </div>
        <div class="flex-shrink-0 my-auto text-center">
          <h3 class="mb-4">Searching for an opponent...</h3>
          <div class="fs-5 py-2">
            <div class="spinner-border border-3"></div>
          </div>
        </div>
        <div class="flex-shrink-0 py-4 mb-2"></div>
      </div>
    `;
  }

  disconnectedCallback() {
    if (this.#ws) {
      this.#ws.close();
      this.#ws = null;
    }
  }

  handleError(e) {
    console.error('WebSocket error:', e);
    redirectTo('/game');

    // TODO: improve error handling
    alert('Matchmaking: An error occured. Please try again.');
  }

  handleMessage(e) {
    try {
      const data = JSON.parse(e.data);
      if (data?.game_id) {
        redirectTo(`/game/online/${data.game_id}`);
      } else {
        throw new Error({ error: 'game_id missing' });
      }
    } catch (err) {
      this.handleError(err);
    }
  }
}

customElements.define('view-game-online-matchmaking', ViewGameOnlineMatchmaking);
