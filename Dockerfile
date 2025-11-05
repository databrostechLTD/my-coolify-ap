# Use official nginx image
FROM nginx:stable-alpine

# Remove default nginx config and files
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/*

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all your site files into nginx html directory
COPY . /usr/share/nginx/html/

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Healthcheck to verify container health
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost/ || exit 1

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
