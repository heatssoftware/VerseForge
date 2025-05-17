import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://esgnswgkwadevqmhkpnl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ25zd2drd2FkZXZxbWhrcG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA2OTQsImV4cCI6MjA2MjAzNjY5NH0.iVn2fxpkOImcKqiTqtkjmUShTA1c64RwiNf-fHWFWhU';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {
    // Progress Bar
    const currentAmount = 200;
    const targetAmount = 300;
    const progressItems = document.querySelectorAll('.Aitem');
    const progress_text = document.querySelector('.progress-text');
    const progress_bar_fill = document.querySelector('.progress_bar_fill');

    const progressPercent = Math.min((currentAmount / targetAmount) * 100, 100);
    progress_bar_fill.style.setProperty('--target-width', progressPercent.toFixed(1) + '%');
    progress_text.textContent = "$" + currentAmount + ' / $' + targetAmount + ' raised';

    function checkVisibility() {
        const triggerBottom = window.innerHeight / 5 * 4;
        progressItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('show');
                item.classList.remove('hide');
                if (item.classList.contains('progress_bar_fill')) {
                    item.style.setProperty('--target-width', progressPercent.toFixed(1) + '%');
                    item.classList.add('filled');
                }
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
                if (item.classList.contains('progress_bar_fill')) {
                    item.classList.remove('filled');
                }
            }
        });
    }

    // Event listener for scroll
    window.addEventListener('scroll', checkVisibility);

    // Initial call to show elements in view
    checkVisibility();

    // Enable smooth scrolling via CSS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Form handling
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        if (email && form.checkValidity()) {
            // Debugging: Ievēro, vai e-pasts tiek iegūts
            console.log('Submitting email:', email);

            const { data, error } = await supabase
                .from('waitlist')
                .insert([{ email: email }]);

            if (error) {
                // Debugging: Skatīsimies uz kļūdām
                alert('Error: ' + error.message);
                console.error(error);
            } else {
                // Debugging: Pārbaudīsim, vai dati tiek ievietoti
                console.log('Inserted email:', data);
                form.reset();
                window.location.href = 'thanks';
            }
        }
    });

});

const email_counter = document.querySelector('.email_counter span');

const { data, error, count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact' });

if (error) {
    console.error('Error fetching count:', error);
} else {
    const spots_left = 300 - count;
    if (count > 300) {
        spots_left = 1000 - count;
    }
    email_counter.innerHTML = `
    <strong style="color:#32CD32;">
    Hurry up! Only ${spots_left} spots left to join <span style="text-decoration: underline;">VerseForge!</span>
    </strong>`;
    email_counter.classList.add('show');
    email_counter.classList.remove('hide');

}


