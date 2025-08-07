
document.addEventListener("DOMContentLoaded", function () {
  
  const path = window.location.pathname;
  
  if (path.endsWith("thanks-google") || path.endsWith("thanks-google.html")) {
    handleLogin();
    return;
  }
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');
  const form = document.querySelector('form');

  // Pārliecinies, ka paziņojumi ir paslēpti
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      errorMsg.textContent = 'Please enter a valid email address.';
      errorMsg.style.display = 'block';
      return;
    }

    try {
      await joinWaitlist(email);
      handleShareAndRedirect(email);
    } catch (err) {
      let message = err.message === 'Email is not valid'
        ? 'Please enter a valid email address.'
        : 'Something went wrong. Please try again.';

      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
      console.log('❌ Error:', err.message);
    }
  });
});


function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}



async function fetchWaitlistCount() {
  try {
    const response = await fetch('https://esgnswgkwadevqmhkpnl.supabase.co/functions/v1/waitlist-count');
    const result = await response.json();
    
    if (response.ok) {
      return result.count;
    } else {
      console.error('❌ Kļūda:', result.error);
      return 0;
    }
  } catch (err) {
    console.error('❌ Tīkla kļūda:', err);
    return 0;
  }
}


async function joinWaitlist(email) {
  const res = await fetch('https://esgnswgkwadevqmhkpnl.supabase.co/functions/v1/waitlist-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Unknown error occurred');
  }
  
  return await res.json();
}



async function ShareByEmailRef(ref_email, email) {
  try {
    const res = await fetch('https://esgnswgkwadevqmhkpnl.supabase.co/functions/v1/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: ref_email, email: email }),
    });

    if (res.ok) {
      console.log('✅ Share added!');
    } else {
      const err = await res.json();
      console.log('❌ Error:', err);
    }
  }
  catch (error) {
    console.error('❌ CORS error:', error);
  }
}

async function handleShareAndRedirect(email) {
  const params = new URLSearchParams(window.location.search);
  const ref_email = params.get('ref');
  if (ref_email && ref_email !== email) {
    await ShareByEmailRef(ref_email, email);
  }

  // Paslēpt formu, parādīt success ziņojumu
  const form = document.getElementById('waitlist-form');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');

  form.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';
  successMsg.style.display = 'block';
  successMsg.textContent = "Thanks! You're on the list. Your unique sharing link will be sent to your email.";
}

const supabaseClient = supabase.createClient('https://esgnswgkwadevqmhkpnl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ25zd2drd2FkZXZxbWhrcG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA2OTQsImV4cCI6MjA2MjAzNjY5NH0.iVn2fxpkOImcKqiTqtkjmUShTA1c64RwiNf-fHWFWhU');

async function signInWithGoogle() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
    redirectTo: 'https://verseforge.site/thanks-google.html'
    }
  });
}


async function handleLogin() {
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');
  const { data: { user } } = await supabaseClient.auth.getUser();
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  var email = '';
  if (user && user.email) {
    email = user.email;
  } else {
    errorMsg.textContent = 'You need to log in first.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    await joinWaitlist(email);
    handleShareAndRedirect(email);
  } catch (err) {
    let message = err.message === 'Email is not valid'
      ? 'Please enter a valid email address.'
      : 'Something went wrong. Please try again.';
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    console.log('❌ Error:', err.message);
  }
}