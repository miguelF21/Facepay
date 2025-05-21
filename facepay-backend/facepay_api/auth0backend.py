import json
import requests
from django.conf import settings
import jwt
from rest_framework import authentication, exceptions
import jwt


class Auth0JSONWebTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or auth_header[0].lower() != b'bearer':
            return None

        token = auth_header[1]

        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError:
            raise exceptions.AuthenticationFailed('Invalid header')

        jwks = requests.get(f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json').json()
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }

        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=['RS256'],
                    audience=settings.AUTH0_API_IDENTIFIER,
                    issuer=f'https://{settings.AUTH0_DOMAIN}/'
                )
            except jwt.ExpiredSignatureError:
                raise exceptions.AuthenticationFailed('Token expired')
            except jwt.JWTClaimsError:
                raise exceptions.AuthenticationFailed('Invalid claims')
            except Exception:
                raise exceptions.AuthenticationFailed('Invalid token')

            return (payload, token)
        
        

        raise exceptions.AuthenticationFailed('Unable to find appropriate key')
