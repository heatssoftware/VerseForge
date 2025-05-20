const params = new URLSearchParams(window.location.search);
const email = params.get('email');

function generateEmailShareLink() {
  return `http://127.0.0.1:5500?ref=${encodeURIComponent(email)}`;
}

function copyLink() {
    const link = document.getElementById('inviteLink');
    const url = link.value;
    navigator.clipboard.writeText(url)
        .catch(err => console.error('Failed to copy link:', err));

    const copyButton = document.getElementById('copyBtn');
    copyButton.innerText = 'Copied!';
    copyButton.style.backgroundColor = '#4CAF50';

    setTimeout(() => {
        copyButton.innerText = 'Copy Link';
        copyButton.style.backgroundColor = 'var(--accent-color)';
    }, 2000);
}





const inviteLink = document.getElementById('inviteLink');
inviteLink.value = generateEmailShareLink();