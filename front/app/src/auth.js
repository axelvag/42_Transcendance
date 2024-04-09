const BASE_URL = import.meta.env.BASE_URL;
import { redirectTo } from '@/router.js';
import { notify } from '@/notifications.js';
const API_BASE_URL = 'https://127.0.0.1:8001';

const user = {
  isAuthenticated: undefined,
  id: null,
  username: null,
  email: null,
  avatar: null,
  firstname: null,
  lastname: null,
  avatar: null,
  avatarDefault: null,
  avatarDefault42: null,

  //stat
  victories: 0,
  lost: 0,
  online: 0,
  local: 0,
  timeplay: 0,
  nbtotal: 0,
  friends: 0,
};

const setLocalAvatar = avatar => {
  user.avatar = avatar || '/assets/img/default-profile.jpg';
};

const setLocalUser = data => {
  localStorage.setItem('isLogged', 'true');
  user.isAuthenticated = true;
  user.id = data.id || '';
  user.email = data.email || '';
  user.username = data.username || '';
  setLocalAvatar(data.avatar);
  user.firstname = data.firstname || '';
  user.lastname = data.lastname || '';
  user.id = data.id;
  user.email = data.email;
  user.username = data.username;
  user.avatarDefault = '/assets/img/default-profile.jpg';
  user.avatarDefault42 = data.avatar42;

  //stat
  user.victories = 183;
  user.lost = 13;
  user.online = 160;
  user.local = 27;
  user.timeplay = 130;
  user.nbtotal = 1;
  user.friends = 0;
  // user.victories = data.victories;
  // user.lost = data.lost;
  // user.online = data.online;
  // user.local = data.local;
  // user.nbtotal = data.nbtotal;
  // user.timeplay = data.timeplay;
  // user.friends = data.friends;
};

const resetLocalUser = () => {
  // localStorage.setItem('isLogged', 'false');
  user.isAuthenticated = false;
  user.id = null;
  user.email = null;
  user.username = null;
  user.avatar = null;
  user.firstname = null;
  user.lastname = null;
  user.avatarDefault = null;
  user.avatarDefault42 = null;

  //stat
  user.victories = 0;
  user.lost = 0;
  user.online = 0;
  user.local = 0;
  user.timeplay = 0;
  user.nbtotal = 0;
  user.friends = 0;
  user.avatar = null;
};

const isAuthenticated = async () => {
  try {
    if (user.isAuthenticated === undefined) {
      resetLocalUser();
      const response = await fetch(`${API_BASE_URL}/accounts/is_user_logged_in/`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setLocalUser(data);
        console.log("dwedededee",user.id);
        const csrfToken = await getCsrfToken();
        const userProfileResponse = await fetch(`https://127.0.0.1:8001/accounts/get_user_profile/${user.id}/`, {
          method: 'GET',
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });
        const userProfileData = await userProfileResponse.json();
        console.log(userProfileData);
        if (userProfileData.getProfile.success) {
          console.log(userProfileData.getProfile.avatar42);
          setLocalUser(userProfileData.getProfile);
        } else {
          console.error('Failed to load user profile:', userProfileData.message);
        }
      } else {
        resetLocalUser();
      }
    }
  } catch (error) {
    console.error('Error:', error);
    resetLocalUser();
  }
  return user.isAuthenticated;
};

const getCsrfToken = async () => {
  const response = await fetch('https://127.0.0.1:8001/accounts/get-csrf-token/', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data.csrfToken;
  }
  throw new Error('Could not retrieve CSRF token');
};

const logout = async () => {
  try {
    const csrfToken = await getCsrfToken();
    await fetch(`${API_BASE_URL}/accounts/logout/`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken,
      },
    });
    notify({
      icon: 'info',
      iconClass: 'text-info',
      message: 'You have been <b>logged out</b> successfully!',
    });
  } catch (error) {
    console.error('Error:', error);
    notify({
      icon: 'error',
      iconClass: 'text-danger',
      message: 'Logout failed!',
      autohide: false,
    });
  }

  resetLocalUser();
};

const getProfile = () => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    avatar: user.avatar,
    avatarDefault: user.avatarDefault,
    avatarDefault42: user.avatarDefault42,
  };
};

const saveUser = async newUser => {
  const formData = new FormData();
  formData.append('username', newUser.username);
  formData.append('email', newUser.email);
  formData.append('firstname', newUser.firstname);
  formData.append('lastname', newUser.lastname);
  formData.append('id', newUser.id);

  if (newUser.avatarFile) {
    formData.append('avatar', newUser.avatarFile);
  }

  console.log("formData", formData);

  // Pour afficher le contenu de formData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch('https://127.0.0.1:8001/accounts/update_user/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('La requête a échoué avec le statut ' + response.status);
    }

    const data = await response.json();
    if (data.update.success) {
      //MAJ object user
      user.firstname = data.update.firstname;
      user.lastname = data.update.lastname;
      user.username = data.update.username;
      user.email = user.email;

      if (!data.update.avatar) {
        if (user.avatarDefault42 !== null && user.avatarDefault42 !== undefined) user.avatar = user.avatarDefault42;
        else user.avatar = '/assets/img/default-profile.jpg';
      } else {
        user.avatar = data.update.avatar;
      }
    }

    return data.update;
  } catch (error) {
    console.error("Erreur lors de l'envoi des données de l'utilisateur:", error);
    return null;
  }
};

const loginUser = async (formData, csrfToken) => {
  const response = await fetch('https://127.0.0.1:8001/accounts/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(formData),
  });
  return response.json();
};

const sendSignUpRequest = async (formData, csrfToken) => {
  const response = await fetch('https://127.0.0.1:8001/accounts/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(formData),
  });
  return response.json();
};

const passwordReset = async (formData, csrfToken) => {
  const response = await fetch('https://127.0.0.1:8001/accounts/password_reset/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(formData),
  });
  return response.json();
};

const sendEmailPasswordReset = async (formData, csrfToken, url) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(formData),
  });
  return response.json();
};

const deleteUser = async csrfToken => {
  const url = `https://127.0.0.1:8001/accounts/delete_user/${user.username}`;
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': csrfToken,
    },
  });

  const data = await response.json();
  if (data.success) {
    console.log('delete user and profil');
    user.isAuthenticated = false;
    resetLocalUser(data);
  }
};

const handleOAuthResponse = async () => {
  if (window.location.search.includes('code=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    try {
      const csrfToken = await getCsrfToken();
      const authResponse = await fetch('https://127.0.0.1:8001/accounts/oauth/callback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ code: code }),
      });

      const data = await authResponse.json();
      if (data.access_token) {
        user.id = data.id;
        user.email = data.email;
        user.username = data.username;
        user.avatar = data.avatar.link;
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.avatarDefault42 = data.avatar.link;
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('firstname', user.firstname);
        formData.append('lastname', user.lastname);
        formData.append('id', user.id);
        formData.append('avatar', user.avatar);
        if(data.register === true){
          console.log("register trueeeeeeeeeeee");
          try {
            for (let [key, value] of formData.entries()) {
              console.log(`${key}: ${value}`);
          }
            const csrfToken = await getCsrfToken();
            const response = await fetch('https://127.0.0.1:8001/accounts/update_user/', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'X-CSRFToken': csrfToken,
              },
              body: formData,
            });

            if (!response.ok) {
              throw new Error('La requête a échoué avec le statut ' + response.status);
            }

            const data = await response.json();
          } catch (error) {
            console.error("Erreur lors de l'envoi des données de l'utilisateur:", error);
          }
        }
        const csrfToken = await getCsrfToken();
        const userProfileResponse = await fetch(`https://127.0.0.1:8001/accounts/get_user_profile/${data.id}/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
                'X-CSRFToken': csrfToken,
              },
        });

        const userProfileData = await userProfileResponse.json();
        console.log(userProfileData);
        if (userProfileData.getProfile.success) {
          setLocalUser(userProfileData.getProfile);
          redirectTo('/dashboard');
          notify({
            icon: 'info',
            iconClass: 'text-info',
            message: 'You have been <b>logged in</b> successfully!',
          });
        } else {
          console.error('Failed to load user profile:', userProfileData.message);
          notify({
            icon: 'error',
            iconClass: 'text-danger',
            message: 'Failed to load user profile!',
          });
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      notify({
        icon: 'error',
        iconClass: 'text-danger',
        message: 'login with 42 failed!',
      });
    }
  }
};

const getAuthorizationCode = () => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-032700fdff8bf6b743669184234c5670698f0f0ef95b498514fc13b5e7af32f0&redirect_uri=https%3A%2F%2F127.0.0.1%3A8000%2Fauth42-callback&response_type=code`;
  window.location.href = url;
};

export {
  user,
  isAuthenticated,
  logout,
  deleteUser,
  getProfile,
  getCsrfToken,
  loginUser,
  sendSignUpRequest,
  passwordReset,
  sendEmailPasswordReset,
  handleOAuthResponse,
  getAuthorizationCode,
  saveUser,
  setLocalUser,
  resetLocalUser,
};
