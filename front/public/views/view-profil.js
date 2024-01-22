class ViewProfil extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <main class="profile-container">
            <div class="profile-card">

                <section class="profile-header">
                    <img id="avatar-preview" src="path_to_default_avatar_image" alt="Modify Avatar"">
                    <input type="file" id="avatar-input" style="display: none;" accept="image/*">
                    <button class="avatar-button">Change avatar</button>
                </section>

                <form class="profile-form">
                
                    <div class="form-group">
                        <label for="first-name">First Name</label>
                        <input type="text" id="first-name" value="" required>
                    </div>
                    <div class="form-group">
                        <label for="last-name">Last Name</label>
                        <input type="text" id="last-name" value="" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" value="" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" value="" required>
                    </div>
                    <div class="form-actions">
                        <button type="cancel-button" class="cancel-button">Annuler</button>
                        <button type="submit" class="save-button">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </main>
        `;

    const cancelButton = this.querySelector('.cancel-button');
    const profileForm = this.querySelector('.profile-form');
    const avatarButton = this.querySelector('.avatar-button');
    const avatarInput = this.querySelector('#avatar-input');

    cancelButton.addEventListener('click', () => {
      profileForm.reset(); // Réinitialise le formulaire
    });

    profileForm.addEventListener('submit', this.saveProfile);

    avatarButton.addEventListener('click', () => {
        avatarInput.click(); // Déclenche le clic sur le input caché
      });


      avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader(); // objet js pour lire les contenu des fichier stocke
            reader.onload = (e) => {
                const preview = document.getElementById('avatar-preview');
                console.log("test==",preview);
                preview.src = e.target.result; // Met à jour la source de l'élément img
            };
            reader.readAsDataURL(file); // Lit le fichier et déclenche l'événement onload
        }
    });
    
  }

  

  saveProfile(event) {
    event.preventDefault();

    const firstName = this.querySelector('#first-name').value;
    const lastName = this.querySelector('#last-name').value;
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;

    //Tests
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);

    // Ici, vous pouvez appeler la méthode fetch pour envoyer les données
    // à votre serveur
    // fetch('/path_to_your_server_endpoint', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         firstName: firstName,
    //         lastName: lastName,
    //         email: email,
    //         password: password
    //     })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Traiter la réponse ici
    //     console.log('Success:', data);
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
  }
}

customElements.define('view-profil', ViewProfil);
