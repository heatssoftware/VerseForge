var isMobile = window.innerHeight > window.innerWidth;

document.addEventListener("DOMContentLoaded", function () {
  // Progress Bar
  const currentAmount = 20;
  const targetAmount = 300;
  const progressItems = document.querySelectorAll('.fade-in');
  const progress_text = document.querySelector('.progress-text');
  const progress_bar_fill = document.querySelector('.progress_bar_fill');
  
  const progressPercent = Math.min((currentAmount / targetAmount) * 100, 100);
  progress_bar_fill.style.setProperty('--target-width', progressPercent.toFixed(1) + '%');
  progress_text.textContent = "$" + currentAmount + ' / $' + targetAmount + ' raised';
  
  function checkVisibility() {
    const triggerBottom = window.innerHeight / 5 * 4;
    let featureCardIndex = 0;
    progressItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        if (item.classList.contains("feature-card")) {
          if (item.classList.contains("hide")) { featureCardIndex++; }
            setTimeout(() => {
              item.classList.add('show');
              item.classList.remove('hide');
            }, featureCardIndex * 200);
        } else {
          item.classList.add('show');
          item.classList.remove('hide');
        }
        if (item.classList.contains('progress_bar_fill')) {
          item.style.setProperty('--target-width', progressPercent.toFixed(1) + '%');
          item.classList.add('filled');
        }
        if (item.classList.contains("hr_line")) {
          item.style.setProperty('--target-width', "80%");
          item.classList.add('filled');
        }
      } else {
        item.classList.remove('show');
        item.classList.add('hide');
        if (item.classList.contains('progress_bar_fill') || item.classList.contains("hr_line")) {
          item.classList.remove('filled');
        }
      }
    });
  }
  
  // Event listener for scroll
  window.addEventListener('scroll', checkVisibility);
  
  // Initial call to show elements in view
  checkVisibility();
  
  const form = document.querySelector('form');
  
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const email = form.querySelector('input[type="email"]').value.trim();
  
    if (!email || !form.checkValidity()) return;
  
    try {
      await joinWaitlist(email);
      handleShareAndRedirect(email);
    } catch (err) {
      console.error('❌ Kļūda:', err.message);

    }
  });
});

async function fetchWaitlistCount() {
  try {
    const response = await fetch('https://esgnswgkwadevqmhkpnl.supabase.co/functions/v1/waitlist-count');
    const result = await response.json();

    if (response.ok) {
      return result.count;
    } else {
      console.error('❌ Kļūda:', result.error);
    }
  } catch (err) {
    console.error('❌ Tīkla kļūda:', err);
  }
}



let currentScroll = 0;
let targetScroll = 0;
const ease = 0.1;

function updateScroll() {
  currentScroll += (targetScroll - currentScroll) * ease;
  window.scrollTo(0, currentScroll);
  requestAnimationFrame(updateScroll);
}

if (isMobile) {
    document.body.style.overflow = 'none';
} else {
    window.addEventListener('wheel', e => {
      e.preventDefault();
      targetScroll += e.deltaY;
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    }, { passive: false });
    
    updateScroll();
    document.body.style.overflow = 'hidden';
}


const waitlistBtn = document.querySelector('.waitlist-btn');
const waitlistSection = document.getElementById('waitlist-section');

window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.9) {
        waitlistBtn.style.opacity = '1';
        waitlistBtn.style.pointerEvents = 'auto';
        waitlistBtn.style.transform = 'translateY(0)';
    } else {
        waitlistBtn.style.opacity = '0';
        waitlistBtn.style.pointerEvents = 'none';
        waitlistBtn.style.transform = 'translateY(calc(100% + 4vw))';
    }
});

function scrollToWaitlist() {
    waitlistSection.scrollIntoView({ behavior: 'smooth' });
    targetScroll = 0;
}

window.scrollToWaitlist = scrollToWaitlist;


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
    throw new Error(err.error || 'Nezināma kļūda');
  }

  return await res.json(); // Atgriež servera atbildi
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
      console.error('❌ Kļūda:', err);
    }
  } catch (error) {
    console.error('❌ Tīkls vai CORS kļūda:', error);
  }
}

async function handleShareAndRedirect(email) {
  const params = new URLSearchParams(window.location.search);
  const ref_email = params.get('ref');
  console.log('Ref email:', ref_email);
  console.log('Current email:', email);
  if (ref_email && ref_email !== email) {
    await ShareByEmailRef(ref_email, email);
  }
  window.location.href = `/thanks.html?email=${encodeURIComponent(email)}`;
}





const email_counter = document.querySelector('.email_counter span');
const count = await fetchWaitlistCount();
email_counter.innerHTML = `
Join the growing <span style="font-weight: 600; color: var(--accent-color);">VerseForge</span> community — ${count} waitlisted!`;
email_counter.classList.add('show');
email_counter.classList.remove('hide');