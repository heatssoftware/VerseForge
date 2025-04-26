
fetch('list.json')
  .then(response => response.json())
  .then(blogs => {
    const list = document.getElementById('blog-list');
    list.innerHTML = ''; // notīra "Notiek ielāde..."

    if (blogs.length === 0) {
      list.innerHTML = '<li>Nav pievienotu blogu.</li>';
      return;
    }

    blogs.forEach(blog => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <a href="./${blog.path}" class="card-link">
          <img src="./${blog.path}cover.jpg" alt="${blog.title}" class="card-image"
              onerror="this.onerror=null;this.src='default-cover.jpg';">
          <div class="card-content">
            <h3 class="card-title">${blog.title}</h3>
            <small class="card-date">${blog.date}</small>
          </div>
        </a>
      `;
      list.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Kļūda ielādējot blogus:', error);
    document.getElementById('blog-list').innerHTML = '<li>Neizdevās ielādēt blogus.</li>';
  });
