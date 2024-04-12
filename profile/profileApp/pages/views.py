from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Profile
from django.contrib.auth import get_user_model
import logging
import requests
from django.contrib.auth.decorators import login_required

User = get_user_model()

@csrf_exempt
def verif_sessionID(view_func):
    def wrapper(request, *args, **kwargs):
        session_id = request.COOKIES.get('sessionid', None)
        update_url = f"http://authentification:8001/accounts/verif_sessionid/{session_id}"
        response = requests.get(update_url)
        
        if response.status_code != 200:
            return JsonResponse({"success": False, "message": "SessionID Invalid"}, status=400)
        
        # Si la vérification est réussie, exécuter la vue originale
        return view_func(request, *args, **kwargs)
    
    return wrapper

@csrf_exempt
@verif_sessionID
@require_http_methods(["POST"])
def update_user(request):
    if request.content_type.startswith('multipart/form-data'): # grace au formData envoyer
        # Extraction des données depuis une requête multipart/form-data
        user_id = request.POST.get('id')
        first_name = request.POST.get('firstname', '')
        last_name = request.POST.get('lastname', '')
        username = request.POST.get('username', '')
        # email = request.POST.get('email', '')
        avatar = request.FILES.get('avatar', None)
        if avatar is None:
            avatar42 = request.POST.get('avatar', None)
        else:
            avatar42 = None
    else:
        # Tentative d'extraction des données JSON
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = data.get('id')
            first_name = data.get('firstname', '')
            last_name = data.get('lastname', '')
            username = data.get('username', '')
            # email = data.get('email', '')
            avatar = request.FILES.get('avatar', None)  # Pas d'avatar dans les données JSON
            if avatar is None:
                avatar42 = data.get('avatar', None)
            else:
                avatar42 = None
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid or missing JSON data."}, status=400)

    # Mise à jour des informations d'authentification via un service externe
    auth_service_url = "http://authentification:8001/accounts/update_profile/"
    auth_data = {'id': user_id, 'username': username}#, 'email': email}

    try:
        auth_response = requests.post(auth_service_url, json=auth_data)
        if auth_response.status_code == 400:
            return JsonResponse({"success": False, "message": "This user name is already taken."})
        if auth_response.status_code != 200:
            return JsonResponse({"success": False, "message": "Failed to update authentication information."})
    except requests.exceptions.RequestException as e:
        logging.error(f"Error calling authentication service: {e}")
        return JsonResponse({"success": False, "message": "Error calling authentication service."})

    # Mise à jour ou création du profil utilisateur dans la base de données locale
    try:
        defaults = {
        'firstName': first_name,
        'lastName': last_name,
        }

    
        # Si un avatar est fourni, ajoutez-le aux valeurs par défaut pour la mise à jour/création
        if avatar is not None:
            defaults['avatar'] = avatar

        profile, created = Profile.objects.update_or_create(
            user_id=user_id,
            defaults=defaults
        )

        if profile.avatar42 is None:
            profile.avatar42 = avatar42
            profile.save()  # Sauvegarder les modifications sur le profil
    except Profile.DoesNotExist:
        # Si aucun profil n'existe pour cet utilisateur et qu'aucun avatar n'est fourni
        profile = Profile.objects.create(
            user_id=user_id,
            firstName=first_name,
            lastName=last_name,
            avatar42=avatar42,
            # Initialisez d'autres champs si nécessaire
        )
    except Exception as e:
        logging.error(f"Error updating or creating profile: {e}")
        return JsonResponse({"success": False, "message": "Error updating or creating profile."})

    # Construction de l'URL de l'avatar
    base_url = 'http://127.0.0.1:8001'

    avatar_url = base_url + profile.avatar.url if profile and profile.avatar else None
    if avatar is None:
        if avatar42 is not None:
            avatar_url = avatar42
            profile.avatar = None
            profile.save()
            
    # Réponse de succès avec les informations mises à jour
    return JsonResponse({
        "success": True,
        "message": "Profile updated successfully.",
        "id": user_id,
        "firstname": profile.firstName,
        "lastname": profile.lastName,
        "username": username,
        # "email": email,
        "avatar": avatar_url,
    })


# @login_required
@csrf_exempt
@verif_sessionID
@require_http_methods(["GET"])  # Utilisez GET si vous récupérez simplement des informations, ajustez selon besoin
def get_user_profile(request, user_id):  # Assurez-vous que user_id est correctement capturé depuis l'URL
    
    logging.critical("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    logging.critical(user_id)

    try:
        # Recherche du profil par user_id
        profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        profile = None

    # Faites un appel au service d'authentification pour obtenir username et email
    auth_service_url = "http://authentification:8001/accounts/get_profile/"
    try:
        auth_response = requests.get(f"{auth_service_url}{user_id}")
        if auth_response.status_code == 200:
            auth_data = auth_response.json()
            username = auth_data.get('username', '')
            email = auth_data.get('email', '')
        else:
            return JsonResponse({"success": False, "message": "Failed to retrieve authentication information."})
    except requests.exceptions.RequestException as e:
        logging.error(f"Error calling authentication service: {e}")
        return JsonResponse({"success": False, "message": "Error calling authentication service."})

    # Construction de l'URL de l'avatar si disponible
    base_url = 'http://127.0.0.1:8001'

    avatar_url = base_url + profile.avatar.url if profile and profile.avatar else None
    if profile is not None and avatar_url is None:
        logging.critical("avatar null")
        avatar_url = profile.avatar42
    # Réponse avec les informations récupérées
    return JsonResponse({
        "success": True,
        "firstname": profile.firstName if profile else '',
        "lastname": profile.lastName if profile else '',
        "username": username,  # Ces informations proviennent du service d'authentification
        "email": email,  # Ces informations proviennent du service d'authentification
        "avatar": avatar_url,
        "id": user_id,
        "avatar42": profile.avatar42 if profile else None,
    })


@csrf_exempt
@verif_sessionID
@require_http_methods(["DELETE"])
def delete_user_profile(request, user_id):
    logging.critical("delete user")
    logging.info(f"Attempting to delete profile for user_id: {user_id}")

    try:
        profile = Profile.objects.get(user_id=user_id)
        profile.delete()
        return JsonResponse({"success": True, "message": "Profile deleted successfully."})
    except Profile.DoesNotExist:
        return JsonResponse({"success": False, "message": "Profile not found."}, status=404)
    except Exception as e:
        logging.error(f"Error deleting profile: {e}")
        return JsonResponse({"success": False, "message": "Error deleting profile."}, status=500)