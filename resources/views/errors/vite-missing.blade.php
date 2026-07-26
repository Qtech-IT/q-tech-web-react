<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>
     {{ config('app.name') }} - {{ translate('Vite Manifest Missing') }}
  </title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    
    body, h1, p, div, a, button {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
      background-color: #f9fafb;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .card {
      background-color: #fff;
      border-radius: 2rem;
      border: 1px solid #e5e7eb;
      padding: 3rem 2.5rem;
      max-width: 450px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px rgba(0,0,0,0.05);
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .icon-wrapper {
      display: inline-flex;
      background-color: #fee2e2;
      padding: 1.5rem;
      border-radius: 9999px;
      margin-bottom: 2rem;
      justify-content: center;
      align-items: center;
    }

    .icon-wrapper svg {
      width: 2.75rem;
      height: 2.75rem;
      color: #dc2626;
    }

    h1 {
      font-size: 2rem; /* slightly larger */
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    p {
      color: #6b7280;
      margin-bottom: 2rem;
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .code {
      font-family: monospace;
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 1.8rem; /* slightly bigger */
      font-weight: 500;
      border-radius: 0.6rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #4f46e5;
      color: #fff;
    }

    .btn-primary:hover {
      background-color: #4338ca;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #111827;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    .btn + .btn {
      margin-left: 1rem;
    }
  </style>

</head>
<body>
  <div class="card">
    
    <!-- Icon -->
    <div class="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
      </svg>
    </div>

    <!-- Heading -->
    <h1>{{ translate('Oops! Vite Manifest Missing') }}</h1>
    <p>
      {{ translate('It seems your Vite assets are not built yet. Please run') }}
      <span class="code">{{ translate('npm run dev') }}</span> {{ translate('or') }}
      <span class="code">{{ translate('npm run build') }}</span>.
    </p>

    <!-- Action buttons -->
    <div>
      <a href="/" class="btn btn-primary">{{ translate('Go Home') }}</a>
      <button onclick="location.reload()" class="btn btn-secondary">{{ translate('Retry') }}</button>
    </div>

  </div>
</body>
</html>
