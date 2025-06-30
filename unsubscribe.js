const params = new URLSearchParams(window.location.search);
const email = params.get('email');

const statusTitle = document.getElementById('status_title');

if (email) {
  fetch('https://esgnswgkwadevqmhkpnl.supabase.co/functions/v1/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(async res => {
    const result = await res.json();
    if (res.ok) {
      statusTitle.textContent = "😔 You’ve Unsubscribed";
    } else {
      statusTitle.textContent = "❌ Error: " + (result.error || "Unknown error");
    }
  });
}
