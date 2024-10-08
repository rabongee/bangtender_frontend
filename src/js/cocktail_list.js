let nextUrl = 'http://localhost:8000/api/v1/cocktail/';
let isLoading = false;

async function fetchCocktails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cocktails:', error);
    }
}

function displayCocktails(cocktails) {
    const cocktailList = document.getElementById('cocktail-list');
    cocktails.forEach(cocktail => {
        const cocktailItem = document.createElement('div');
        cocktailItem.className = 'cocktail-item';
        cocktailItem.innerHTML = `
            <img src="${cocktail.img}" alt="${cocktail.name}" class="cocktail-img" data-id="${cocktail.id}">
            <h3>${cocktail.name}</h3>
        `;
        cocktailList.appendChild(cocktailItem);
    });

    document.querySelectorAll('.cocktail-img').forEach(img => {
        img.addEventListener('click', function () {
            const cocktailId = this.getAttribute('data-id');
            window.location.href = `/pages/cocktail_detail.html?id=${cocktailId}`; // 상세 페이지로 이동
        });
    });
}

async function loadMoreCocktails() {
    if (isLoading || !nextUrl) return;

    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    const data = await fetchCocktails(nextUrl);
    if (data) {
        displayCocktails(data.data.records);
        nextUrl = data.data.next;
        isLoading = false;
        document.getElementById('loading').style.display = 'none';
    }
}

function isNearBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
}

function handleScroll() {
    if (isNearBottom()) {
        loadMoreCocktails();
    }
}

loadMoreCocktails();

window.addEventListener('scroll', handleScroll);