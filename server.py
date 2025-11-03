import http.server
import socketserver
import os
import logging
import signal
import time
import json
from urllib.parse import parse_qs, urlparse
from datetime import datetime, timedelta
from typing import Dict, Optional

# Environment-based configuration
class Config:
    def __init__(self):
        self.ENV = os.getenv('ENVIRONMENT', 'development')
        self.HOST = os.getenv('HOST', '0.0.0.0')  # Use 0.0.0.0 for production
        self.PORT = int(os.getenv('PORT', '3000'))
        self.DIRECTORY = os.path.dirname(os.path.abspath(__file__))
        
        # CORS settings
        self.CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*' if self.ENV == 'development' else 'https://databros.tech')
        
        # Security settings
        self.RATE_LIMIT = int(os.getenv('RATE_LIMIT', '100'))  # requests per minute
        self.RATE_LIMIT_WINDOW = 60  # seconds
        
        # Cache settings
        self.STATIC_CACHE_MAX_AGE = 3600 if self.ENV == 'production' else 0  # 1 hour in production
        
        # Initialize logging
        self._setup_logging()
    
    def _setup_logging(self):
        log_level = logging.DEBUG if self.ENV == 'development' else logging.INFO
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler(os.path.join(self.DIRECTORY, 'server.log'))
            ]
        )

class RateLimiter:
    def __init__(self, requests_per_minute: int):
        self.REQUESTS_PER_MINUTE = requests_per_minute
        self.requests: Dict[str, list] = {}
    
    def is_rate_limited(self, ip: str) -> bool:
        now = datetime.now()
        minute_ago = now - timedelta(seconds=60)
        
        # Clean old entries
        if ip in self.requests:
            self.requests[ip] = [ts for ts in self.requests[ip] if ts > minute_ago]
        else:
            self.requests[ip] = []
        
        # Check rate limit
        if len(self.requests[ip]) >= self.REQUESTS_PER_MINUTE:
            return True
        
        # Add new request
        self.requests[ip].append(now)
        return False

class Handler(http.server.SimpleHTTPRequestHandler):
    rate_limiter: Optional[RateLimiter] = None
    
    def __init__(self, *args, **kwargs):
        self.config = kwargs.pop('config', Config())
        if not Handler.rate_limiter:
            Handler.rate_limiter = RateLimiter(self.config.RATE_LIMIT)
        super().__init__(*args, directory=self.config.DIRECTORY, **kwargs)

    def send_security_headers(self):
        """Add security headers to all responses"""
        security_headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Content-Security-Policy': "default-src 'self'",
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=()',
        }
        for header, value in security_headers.items():
            self.send_header(header, value)

    def send_cors_headers(self):
        """Add CORS headers based on configuration"""
        origins = self.config.CORS_ORIGINS
        self.send_header('Access-Control-Allow-Origin', origins)
        if origins != '*':
            self.send_header('Vary', 'Origin')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Max-Age', '86400')  # 24 hours

    def end_headers(self):
        """Add custom headers before sending response"""
        self.send_security_headers()
        self.send_cors_headers()
        super().end_headers()

    def send_error_response(self, code: int, message: str):
        """Send error response in JSON format"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            'error': {'code': code, 'message': message}
        }).encode('utf-8'))

    def do_GET(self):
        """Handle GET requests with rate limiting and special endpoints"""
        client_ip = self.client_address[0]
        
        # Check rate limit
        if Handler.rate_limiter.is_rate_limited(client_ip):
            self.send_error_response(429, "Too Many Requests")
            return

        # Special endpoints
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'environment': self.config.ENV
            }).encode('utf-8'))
            return

        try:
            # Handle static files
            if '.' in self.path:  # Static file request
                # Add cache headers for static files
                self.send_header('Cache-Control', f'public, max-age={self.config.STATIC_CACHE_MAX_AGE}')
            super().do_GET()
        except Exception as e:
            logging.error(f"Error serving {self.path}: {str(e)}")
            self.send_error_response(500, "Internal Server Error")

    def log_message(self, format: str, *args) -> None:
        """Override to use proper logging"""
        logging.info(f"{self.client_address[0]} - {format%args}")

def create_server(config: Config) -> socketserver.TCPServer:
    """Create and configure the server"""
    class CustomHandler(Handler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, config=config, **kwargs)
    
    socketserver.TCPServer.allow_reuse_address = True
    return socketserver.TCPServer((config.HOST, config.PORT), CustomHandler)

def run_server(config: Config = None):
    """Run the server with graceful shutdown"""
    if config is None:
        config = Config()

    # Set up graceful shutdown
    shutdown_event = False

    def signal_handler(signum, frame):
        nonlocal shutdown_event
        logging.info(f"Received signal {signum}")
        shutdown_event = True

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Start server
    with create_server(config) as httpd:
        host = 'localhost' if config.HOST == '0.0.0.0' else config.HOST
        logging.info(f"Server starting on {host}:{config.PORT} (env: {config.ENV})")
        
        while not shutdown_event:
            try:
                httpd.handle_request()
            except Exception as e:
                logging.error(f"Error handling request: {e}")
                if not shutdown_event:
                    time.sleep(1)  # Prevent tight loop on repeated errors
        
        logging.info("Shutting down server gracefully...")
        httpd.server_close()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_server()