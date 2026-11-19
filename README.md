# Portfolio contact delivery

The contact form uses `EmailJS` as the primary provider in `auto` mode. If EmailJS returns an HTTP error, times out, or is not configured, the browser makes one sequential request to `/.netlify/functions/send-contact`.

## Configuration

Set these public values in a small deployment-injected script before `js/app.js` (the EmailJS public key is designed to be public):

```html
<script>
  window.EMAIL_PROVIDER = 'auto';
  window.EMAILJS_CONFIG = {
    serviceId: 'service_...',
    templateId: 'template_...',
    publicKey: 'public_...'
  };
</script>
```

Supported modes are `emailjs`, `auto`, and `backend`. `emailjs` and `auto` both keep EmailJS primary and use the sequential fallback after a technical failure; `backend` skips EmailJS for migration testing.

Configure `EMAIL_BACKEND_URL` and `EMAIL_BACKEND_TOKEN` as Netlify environment variables. They are read only by the function and are never returned to the browser. The backend must accept JSON with `name`, `email`, and `message`.

The function rejects non-POST requests, malformed JSON, payloads over 12 KB, messages over 10,000 characters, and invalid required fields. Logs contain only status and request ID.
