# Simple Dockerfile to serve the static site with nginx
# This copies the contents of the repository's `website/` directory into
# nginx's html root so Coolify can build and serve the site.

FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the website/ folder into nginx html directory
# This Dockerfile lives at the repository root and expects a `website/` folder
# containing the site (so Coolify can build from the repo root while using
# website/ as the actual site content).
COPY web/ /usr/share/nginx/html

# If a custom nginx config is present at this level (website/nginx.conf), copy it
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
