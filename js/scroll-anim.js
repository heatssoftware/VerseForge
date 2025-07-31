var isMobile = window.innerHeight > window.innerWidth;

document.addEventListener("DOMContentLoaded", function () {
  const progressItems = document.querySelectorAll('.fade-in');
  
  function checkVisibility() {
    const triggerBottom = window.innerHeight / 5 * 4;
    let featureCardIndex = 0;
    progressItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        if (item.classList.contains("after-other")) {
          if (item.classList.contains("hide")) { featureCardIndex++; }
            setTimeout(() => {
              item.classList.add('show');
              item.classList.remove('hide');
            }, featureCardIndex * 100);
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

});



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