document.getElementById('searchButton').addEventListener('click', searchImages);

let history = [];
let historyIndex = -1;

function searchImages() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    // Placeholder images for demonstration purposes
    const images = [
        'https://via.placeholder.com/300?text=Image+1',
        'https://via.placeholder.com/300?text=Image+2',
        'https://via.placeholder.com/300?text=Image+3',
        'https://via.placeholder.com/300?text=Image+4',
        'https://via.placeholder.com/300?text=Image+5'
    ];

    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';

    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.addEventListener('click', () => {
            addToHistory(src);
            enlargeImage(src);
        });
        imageGrid.appendChild(img);
    });
}

function addToHistory(src) {
    history = history.slice(0, historyIndex + 1);
    history.push(src);
    historyIndex++;
}

function enlargeImage(src) {
    const relatedImages = [
        'https://via.placeholder.com/100?text=Related+1',
        'https://via.placeholder.com/100?text=Related+2',
        'https://via.placeholder.com/100?text=Related+3',
        'https://via.placeholder.com/100?text=Related+4'
    ];

    let overlay = document.getElementById('overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        });
    }

    overlay.innerHTML = `
        <div class="toolbar">
            <i class="fas fa-times" id="closeButton"></i>
            <i class="fas fa-search-plus" id="zoomInButton"></i>
            <i class="fas fa-search-minus" id="zoomOutButton"></i>
            <i class="fas fa-download" id="downloadButton"></i>
        </div>
        <div class="main-image-container">
            <img src="${src}" id="mainImage">
        </div>
        <div class="related-grid"></div>
        <div class="nav-buttons">
            <i class="fas fa-arrow-left" id="backButton"></i>
            <i class="fas fa-arrow-right" id="forwardButton"></i>
        </div>
    `;

    const relatedGrid = overlay.querySelector('.related-grid');
    relatedImages.forEach(relatedSrc => {
        const img = document.createElement('img');
        img.src = relatedSrc;
        img.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents closing overlay on click
            addToHistory(relatedSrc);
            enlargeImage(relatedSrc);
        });
        relatedGrid.appendChild(img);
    });

    document.getElementById('closeButton').addEventListener('click', (event) => {
        event.stopPropagation();
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    });

    document.getElementById('zoomInButton').addEventListener('click', (event) => {
        event.stopPropagation();
        const image = overlay.querySelector('#mainImage');
        const currentScale = image.style.transform ? parseFloat(image.style.transform.match(/scale\(([^)]+)\)/)[1]) : 1;
        image.style.transform = `scale(${currentScale + 0.1})`;
    });

    document.getElementById('zoomOutButton').addEventListener('click', (event) => {
        event.stopPropagation();
        const image = overlay.querySelector('#mainImage');
        const currentScale = image.style.transform ? parseFloat(image.style.transform.match(/scale\(([^)]+)\)/)[1]) : 1;
        image.style.transform = `scale(${currentScale - 0.1})`;
    });

    document.getElementById('downloadButton').addEventListener('click', (event) => {
        event.stopPropagation();
        const a = document.createElement('a');
        a.href = src;
        a.download = src.split('/').pop();
        a.click();
    });

    document.getElementById('backButton').addEventListener('click', (event) => {
        event.stopPropagation();
        if (historyIndex > 0) {
            historyIndex--;
            enlargeImage(history[historyIndex]);
        }
    });

    document.getElementById('forwardButton').addEventListener('click', (event) => {
        event.stopPropagation();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            enlargeImage(history[historyIndex]);
        }
    });

    setTimeout(() => overlay.classList.add('show'), 10);
}
