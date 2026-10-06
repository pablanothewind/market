# Amburn’s Market

## Runtime

Django 5.2.17 LTS, Python 3.13.12, and PostgreSQL 14 or newer.
`runtime.txt` selects the Python version on DigitalOcean App Platform.
Use an Ubuntu-22 stack and a Python buildpack supporting this runtime.

The production requirements contain only packages used by the application,
including updated Gunicorn, WhiteNoise, and PostgreSQL drivers. The public
HTML, CSS, JavaScript, accessibility improvements, and SEO are unchanged.

## Before deploying this upgrade

- Confirm that the production PostgreSQL server is version 14 or newer.
- Preserve `DATABASE_URL` and a stable, private `DJANGO_SECRET_KEY` in the
  DigitalOcean environment; do not commit credentials.
- Keep `DEBUG=False` and `DEVELOPMENT_MODE=False` in production.
- Take a database backup before applying Django’s built-in migrations.
- Install requirements, run `python manage.py check`, and run
  `python manage.py migrate --plan` against a staging database first.
- Run `python manage.py migrate --noinput` against the production database
  as a pre-deployment job before starting the upgraded service.
- Retain the existing static-file build step:
  `python manage.py collectstatic --noinput`.
- Retain the existing run command, for example:
  `gunicorn --worker-tmp-dir /dev/shm market.wsgi:application`.

An accidental GitHub page footer was removed from the original initial
migration so Django can import it. No application database schema changes
were introduced by this upgrade.

This code update alone does not upgrade the running DigitalOcean service.
Production compatibility and deployment still need confirmation.
