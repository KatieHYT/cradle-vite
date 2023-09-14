# Use the base image
FROM nvcr.io/nvidia/pytorch:21.03-py3

# Set the environment variable to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install Apache2 and other required packages
RUN apt-get update && \
    apt-get install -y tzdata && \
    apt-get install -y apache2

# Copy the Apache configuration file
COPY cradle-wiki.conf /etc/apache2/sites-available/cradle-wiki.conf
COPY dist /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80
EXPOSE 443

# Start Apache2 in the foreground
CMD ["apache2ctl", "-D", "FOREGROUND"]

