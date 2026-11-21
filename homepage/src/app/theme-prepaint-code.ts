export const themePrepaintCode = `<script>
  const savedTheme = document.cookie.split(';').map(part => part.trim())
    .find(part => part.startsWith('goodui-theme='))?.slice('goodui-theme='.length);
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);
</script>
<style>
  html { background-color: #fff; color-scheme: light; }
  html[data-theme="dark"] { background-color: #09090b; color-scheme: dark; }
  body { background-color: inherit; }
</style>`;
