import jwt, requests
from jwt import InvalidAlgorithmError, ExpiredSignatureError, InvalidAudienceError, PyJWTError
from django.conf import settings
from rest_framework import authentication, exceptions

class Auth0JSONWebTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return None
        parts = auth.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            raise exceptions.AuthenticationFailed('Header Authorization inválido')
        token = parts[1]

        # JWKS
        jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = { k: key[k] for k in ('kty','kid','use','n','e') }
        if not rsa_key:
            raise exceptions.AuthenticationFailed('Llave pública no encontrada')

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=['RS256'],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f'https://{settings.AUTH0_DOMAIN}/'
            )

        except InvalidAlgorithmError:
            raise exceptions.AuthenticationFailed('Token firmado con un algoritmo no soportado')
        except ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expirado')
        except InvalidAudienceError:
            raise exceptions.AuthenticationFailed('Audience inválido en el token')
        except PyJWTError:
            raise exceptions.AuthenticationFailed('Token inválido')


        return (payload, token)