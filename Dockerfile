# Simple Dockerfile to serve the static site with nginx
# This copies the contents of the repository's `website/` directory into
# nginx's html root so Coolify can build and serve the site.

FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site files into nginx html directory
COPY . /usr/share/nginx/html

# Custom nginx config (optional override)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
