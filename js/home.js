

document.addEventListener("DOMContentLoaded", function () {
  animateCounter();
});


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

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

async function animateCounter() {
  const email_counter = document.querySelector('.email_text');
  const count = await fetchWaitlistCount();
  const target = count + 76;

  const duration = 1000;
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  function update() {
    frame++;
    const progress = frame / totalFrames;
    const easedProgress = easeOutCubic(progress);
    const current = Math.round(target * easedProgress);

    email_counter.innerHTML = `${current} already joined the waitlist!`;

    if (frame < totalFrames) {
      requestAnimationFrame(update);
    } else {
      email_counter.innerHTML = `${target} already joined the waitlist!`;
    }
  }

  requestAnimationFrame(update);
}
